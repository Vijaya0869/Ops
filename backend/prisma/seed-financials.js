// Reads prisma/seed-financials-data.json and inserts expenses/income/
// projects/renovation-items/lenders/loans, linking to properties that
// already exist (by address) for the given user.
// Run from backend/: node prisma/seed-financials.js

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DATE_FIELDS = ['expenseDate', 'incomeDate', 'startDate', 'endDate'];

function withDates(record) {
  const copy = { ...record };
  for (const field of DATE_FIELDS) {
    if (copy[field]) copy[field] = new Date(copy[field]);
  }
  return copy;
}

async function main() {
  const dataPath = path.join(__dirname, 'seed-financials-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const user = await prisma.user.findUnique({ where: { email: data.userEmail } });
  if (!user) {
    throw new Error(`No user found with email ${data.userEmail}`);
  }

  const properties = await prisma.property.findMany({ where: { userId: user.id } });
  const propertyByAddress = new Map(properties.map((p) => [p.address, p]));

  function requireProperty(address) {
    const property = propertyByAddress.get(address);
    if (!property) throw new Error(`No property found with address "${address}" — run seed.js first.`);
    return property;
  }

  console.log(`Seeding financials for ${user.email} (${user.id})`);

  for (const expense of data.expenses || []) {
    const property = requireProperty(expense.propertyAddress);
    const { propertyAddress, ...rest } = expense;
    const created = await prisma.expense.create({
      data: { ...withDates(rest), propertyId: property.id, userId: user.id },
    });
    console.log(`  expense: ${created.category} - ${created.description} ($${created.amount}) @ ${property.address}`);
  }

  for (const income of data.income || []) {
    const property = requireProperty(income.propertyAddress);
    const { propertyAddress, ...rest } = income;
    const created = await prisma.income.create({
      data: { ...withDates(rest), propertyId: property.id, userId: user.id },
    });
    console.log(`  income: ${created.category} - ${created.description} ($${created.amount}) @ ${property.address}`);
  }

  for (const projectData of data.projects || []) {
    const property = requireProperty(projectData.propertyAddress);
    const { propertyAddress, renovationItems, ...rest } = projectData;
    const project = await prisma.project.create({
      data: { ...withDates(rest), propertyId: property.id, userId: user.id },
    });
    console.log(`  project: ${project.name} @ ${property.address}`);

    for (const item of renovationItems || []) {
      const created = await prisma.renovationItem.create({
        data: { ...item, propertyId: property.id, projectId: project.id, userId: user.id },
      });
      console.log(`    item: ${created.category} (est $${created.estimatedCost})`);
    }
  }

  const lenderByName = new Map();
  for (const lenderData of data.lenders || []) {
    const created = await prisma.lender.create({ data: { ...lenderData, userId: user.id } });
    lenderByName.set(created.name, created);
    console.log(`  lender: ${created.name}`);
  }

  for (const loanData of data.loans || []) {
    const property = requireProperty(loanData.propertyAddress);
    const lender = lenderByName.get(loanData.lenderName);
    const { propertyAddress, lenderName, ...rest } = loanData;
    const created = await prisma.loan.create({
      data: { ...withDates(rest), propertyId: property.id, lenderId: lender?.id, userId: user.id },
    });
    console.log(`  loan: $${created.principal} @ ${created.interestRate}% - ${property.address} (${lender?.name})`);
  }

  console.log('\nDone.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
