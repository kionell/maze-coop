import { Module } from '@nestjs/common';
import { DashboardGateway } from './dashboard.gateway';
import { DashboardService } from './dashboard.service';

@Module({
  providers: [DashboardGateway, DashboardService]
})
export class DashboardModule {}
