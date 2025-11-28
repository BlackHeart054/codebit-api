import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsService } from './snippets.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  snippet: {
    findMany: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockReturnValue({ id: 1, title: 'Test' }),
    count: jest.fn().mockResolvedValue(0),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  $queryRawUnsafe: jest.fn(),
};

describe('SnippetsService', () => {
  let service: SnippetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnippetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SnippetsService>(SnippetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a snippet', async () => {
    // Mock do retorno do banco
    const mockSnippet = { id: 1, title: 'Test', author: { name: 'Dev' }, comments: [] };
    mockPrismaService.snippet.findUnique.mockResolvedValue(mockSnippet);

    const result = await service.findOne(1);

    expect(result).toEqual(mockSnippet);
    
    // ATUALIZAÇÃO IMPORTANTE AQUI:
    // Agora verificamos se ele chamou o banco pedindo também os comentários
    expect(mockPrismaService.snippet.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { 
        author: { select: { name: true } },
        comments: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      },
    });
  });

  it('should create a snippet', async () => {
    const dto = { title: 'Test', language: 'JS', code: 'console.log()', tags: [] };
    expect(await service.create(1, dto)).toEqual({ id: 1, title: 'Test' });
  });
});