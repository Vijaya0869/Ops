import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PropertiesModule } from './properties/properties.module';
import { DealsModule } from './deals/deals.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomeModule } from './income/income.module';
import { ProjectsModule } from './projects/projects.module';
import { RenovationItemsModule } from './renovation-items/renovation-items.module';
import { LendersModule } from './lenders/lenders.module';
import { LoansModule } from './loans/loans.module';
import { TenantsModule } from './tenants/tenants.module';
import { RentPaymentsModule } from './rent-payments/rent-payments.module';
import { DealCostsModule } from './deal-costs/deal-costs.module';
import { DealAnalysesModule } from './deal-analyses/deal-analyses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PropertiesModule,
    DealsModule,
    ExpensesModule,
    IncomeModule,
    ProjectsModule,
    RenovationItemsModule,
    LendersModule,
    LoansModule,
    TenantsModule,
    RentPaymentsModule,
    DealCostsModule,
    DealAnalysesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
