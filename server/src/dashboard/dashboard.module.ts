import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';

@Module({
  providers: [DashboardGateway, DashboardService],
})
export class DashboardModule {}
