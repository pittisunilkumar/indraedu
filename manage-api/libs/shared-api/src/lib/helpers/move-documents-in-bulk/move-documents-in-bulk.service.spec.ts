import { Test, TestingModule } from '@nestjs/testing';
import { MoveDocumentsInBulkService } from './move-documents-in-bulk.service';

describe('MoveDocumentsInBulkService', () => {
  let service: MoveDocumentsInBulkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoveDocumentsInBulkService],
    }).compile();

    service = module.get<MoveDocumentsInBulkService>(MoveDocumentsInBulkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
