import { WebSocketGateway } from '@nestjs/websockets';
import { DashboardService } from './dashboard.service';

@WebSocketGateway({ cors: true })
export class DashboardGateway {
  constructor(private readonly dashboardService: DashboardService) {}
}
