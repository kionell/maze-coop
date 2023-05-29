import { Module } from '@nestjs/common';
import { DashboardGateway } from './dashboard.gateway';
import { DashboardService } from './dashboard.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [DashboardGateway, DashboardService],
})
export class DashboardModule {}
