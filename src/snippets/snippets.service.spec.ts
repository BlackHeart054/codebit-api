import { Test, TestingModule } from '@nestjs/testing';
import { SnippetsService } from './snippets.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockPrismaService = {
  snippet: {
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
  $queryRawUnsafe: jest.fn(),
};

describe('SnippetsService', () => {
  let service: SnippetsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnippetsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SnippetsService>(SnippetsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um snippet', async () => {
      const dto = { title: 'Test', language: 'JS', code: 'console.log()', tags: [] };
      const expectedResult = { id: 1, ...dto, authorId: 1 };
      
      prisma.snippet.create.mockResolvedValue(expectedResult);

      const result = await service.create(1, dto);

      expect(prisma.snippet.create).toHaveBeenCalledWith({
        data: { ...dto, authorId: 1 },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('deve retornar snippets paginados', async () => {
      prisma.snippet.findMany.mockResolvedValue([{ id: 1, title: 'Test' }]);
      prisma.snippet.count.mockResolvedValue(1);

      const result = await service.findAll('JS', undefined, 1);

      expect(prisma.snippet.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          language: { contains: 'JS', mode: 'insensitive' }
        }),
        take: 10,
        skip: 0
      }));
      
      expect(result).toEqual({
        data: [{ id: 1, title: 'Test' }],
        total: 1,
        page: 1,
        lastPage: 1
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um snippet com comentário', async () => {
      const mockSnippet = { id: 1, title: 'Test', author: { name: 'Dev' }, comments: [] };
      prisma.snippet.findUnique.mockResolvedValue(mockSnippet);

      const result = await service.findOne(1);

      expect(result).toEqual(mockSnippet);
      expect(prisma.snippet.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { 
          author: { select: { name: true, email: true } },
          comments: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
          }
        },
      });
    });

    it('deve retornar um NotFoundException caso não ache um snippet', async () => {
      prisma.snippet.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findRandom', () => {
    it('deve retornar um snippet aleatório', async () => {
      const mockSnippet = { id: 1, title: 'Random' };
      prisma.$queryRawUnsafe.mockResolvedValue([mockSnippet]);

      const result = await service.findRandom();

      expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
      expect(result).toEqual(mockSnippet);
    });

    it('deve retornar null se não existir um snippet', async () => {
      prisma.$queryRawUnsafe.mockResolvedValue([]);
      const result = await service.findRandom();
      expect(result).toBeNull();
    });
  });

  describe('findSnippetOfDay', () => {
    it('deve retornar o snippet do dia', async () => {
      prisma.snippet.count.mockResolvedValue(10);
      prisma.snippet.findFirst.mockResolvedValue({ id: 5 });

      const result = await service.findSnippetOfDay();

      expect(prisma.snippet.count).toHaveBeenCalled();
      expect(prisma.snippet.findFirst).toHaveBeenCalledWith(expect.objectContaining({
        include: { author: { select: { name: true } } }
      }));
      expect(result).toEqual({ id: 5 });
    });

    it('deve retornar null se o contador for 0', async () => {
      prisma.snippet.count.mockResolvedValue(0);
      const result = await service.findSnippetOfDay();
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('deve atualizar se o usuário for dono do snippet', async () => {
      prisma.snippet.findUnique.mockResolvedValue({ id: 1, authorId: 1 });
      prisma.snippet.update.mockResolvedValue({ id: 1, title: 'Updated' });

      const dto = { title: 'Updated' };
      await service.update(1, 1, dto);

      expect(prisma.snippet.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto
      });
    });

    it('deve retornar um NotFoundException se o snippet não existir', async () => {
      prisma.snippet.findUnique.mockResolvedValue(null);
      await expect(service.update(1, 1, {})).rejects.toThrow(NotFoundException);
    });

    it('deve retornar um ForbiddenException se o usuário não for o autor', async () => {
      prisma.snippet.findUnique.mockResolvedValue({ id: 1, authorId: 2 });
      await expect(service.update(1, 1, {})).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deve remover se o usuário for o autor', async () => {
      prisma.snippet.findUnique.mockResolvedValue({ id: 1, authorId: 1 });
      prisma.snippet.delete.mockResolvedValue({ id: 1 });

      await service.remove(1, 1);

      expect(prisma.snippet.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve retornar NotFoundException se o snippet não existir', async () => {
      prisma.snippet.findUnique.mockResolvedValue(null);
      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('deve retornar ForbiddenException se o usuário não for o autor', async () => {
      prisma.snippet.findUnique.mockResolvedValue({ id: 1, authorId: 2 });
      await expect(service.remove(1, 1)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('exportBatch', () => {
    it('deve retornar todos os snippets', async () => {
      prisma.snippet.findMany.mockResolvedValue([{ id: 1 }]);
      await service.exportBatch();
      expect(prisma.snippet.findMany).toHaveBeenCalled();
    });
  });
});