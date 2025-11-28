import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

const mockPrismaService = {
  snippet: {
    findUnique: jest.fn(),
  },
  comment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

describe('CommentsService', () => {
  let service: CommentsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um comentário se o snippet existir', async () => {
      // Mock: Snippet existe
      prisma.snippet.findUnique.mockResolvedValue({ id: 1 });
      // Mock: Retorno do create
      prisma.comment.create.mockResolvedValue({ id: 1, content: 'Nice', userId: 1, snippetId: 1 });

      const dto = { content: 'Nice', snippetId: 1 };
      const result = await service.create(1, dto);

      expect(prisma.snippet.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.comment.create).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ content: 'Nice' }));
    });

    it('deve lançar erro se o snippet não existir', async () => {
      prisma.snippet.findUnique.mockResolvedValue(null);
      
      await expect(
        service.create(1, { content: 'Fail', snippetId: 999 })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve deletar se o usuário for o dono', async () => {
      // Mock: Comentário existe e pertence ao user 1
      prisma.comment.findUnique.mockResolvedValue({ id: 10, userId: 1 });
      
      await service.remove(10, 1); // User 1 tentando deletar

      expect(prisma.comment.delete).toHaveBeenCalledWith({ where: { id: 10 } });
    });

    it('deve lançar erro se o usuário não for o dono', async () => {
      // Mock: Comentário pertence ao user 2
      prisma.comment.findUnique.mockResolvedValue({ id: 10, userId: 2 });

      await expect(
        service.remove(10, 1) // User 1 tentando deletar
      ).rejects.toThrow(NotFoundException);
    });
  });
});