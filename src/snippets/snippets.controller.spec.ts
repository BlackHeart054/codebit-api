import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsController } from './snippets.controller';
import { SnippetsService } from './snippets.service';
import { Response } from 'express';

const mockSnippetsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findRandom: jest.fn(),
  findSnippetOfDay: jest.fn(),
  exportBatch: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockResponse = {
  setHeader: jest.fn(),
  send: jest.fn(),
} as unknown as Response;

describe('SnippetsController', () => {
  let controller: SnippetsController;
  let service: typeof mockSnippetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnippetsController],
      providers: [
        { provide: SnippetsService, useValue: mockSnippetsService },
      ],
    }).compile();

    controller = module.get<SnippetsController>(SnippetsController);
    service = module.get(SnippetsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um snippet', async () => {
    const dto = { title: 'Test', language: 'JS', code: '...', tags: [] };
    const req = { user: { userId: 1 } };
    
    await controller.create(req, dto);
    
    expect(service.create).toHaveBeenCalledWith(1, dto);
  });

  it('deve listar snippets', async () => {
    await controller.findAll('js', 'tag', '1');
    expect(service.findAll).toHaveBeenCalledWith('js', 'tag', 1);
  });

  it('deve buscar um snippet por id', async () => {
    await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('deve atualizar um snippet', async () => {
    const dto = { title: 'Updated' };
    const req = { user: { userId: 1 } };
    await controller.update(1, req, dto);
    expect(service.update).toHaveBeenCalledWith(1, 1, dto);
  });

  it('deve deletar um snippet', async () => {
    const req = { user: { userId: 1 } };
    await controller.remove(1, req);
    expect(service.remove).toHaveBeenCalledWith(1, 1);
  });

  it('deve exportar snippets em lote', async () => {
    const mockData = [{ id: 1, title: 'Export' }];
    service.exportBatch.mockResolvedValue(mockData);

    await controller.export(mockResponse);

    expect(service.exportBatch).toHaveBeenCalled();
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockResponse.send).toHaveBeenCalledWith(JSON.stringify(mockData, null, 2));
  });
});