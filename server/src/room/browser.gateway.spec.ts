import { Test, TestingModule } from '@nestjs/testing';
import { BrowserGateway } from './browser.gateway';

describe('BrowserGateway', () => {
  let gateway: BrowserGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrowserGateway],
    }).compile();

    gateway = module.get<BrowserGateway>(BrowserGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
