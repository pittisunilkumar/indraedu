import { Test, TestingModule } from '@nestjs/testing';
import { SupportTicketService } from './support-ticket.service';

describe('MobileHomeService', () => {
  let service: SupportTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportTicketService],
    }).compile();

    service = module.get<SupportTicketService>(SupportTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
