// Reads prisma/seed-data.json and inserts it under the given user.
// Run from backend/: node prisma/seed.js

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DATE_FIELDS = ['acquisitionDate', 'saleDate'];

function withDates(record) {
  const copy = { ...record };
  for (const field of DATE_FIELDS) {
    if (copy[field]) copy[field] = new Date(copy[field]);
  }
  return copy;
}

async function main() {
  const dataPath = path.join(__dirname, 'seed-data.json');
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  const user = await prisma.user.findUnique({ where: { email: data.userEmail } });
  if (!user) {
    throw new Error(`No user found with email ${data.userEmail} — sign up with that email first.`);
  }

  console.log(`Seeding data for ${user.email} (${user.id})`);

  for (const property of data.properties) {
    const created = await prisma.property.create({
      data: { ...withDates(property), userId: user.id },
    });
    console.log(`  property: ${created.address} [${created.status}]`);
  }

  for (const deal of data.deals) {
    const created = await prisma.deal.create({
      data: { ...deal, userId: user.id },
    });
    console.log(`  deal: ${created.title} [${created.stage}]`);
  }

  console.log(`\nDone: ${data.properties.length} properties, ${data.deals.length} deals inserted.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
