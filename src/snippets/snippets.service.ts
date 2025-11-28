import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@Injectable()
export class SnippetsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateSnippetDto) {
    return this.prisma.snippet.create({
      data: { ...dto, authorId: userId },
    });
  }

  async findAll(language?: string, tag?: string, page = 1) {
    const where: any = {};
    if (language) where.language = { contains: language, mode: 'insensitive' };
    if (tag) where.tags = { has: tag };

    const take = 10;
    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.prisma.snippet.findMany({
        where,
        include: { author: { select: { name: true, email: true } } },
        take,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.snippet.count({ where }),
    ]);

    return { data, total, page, lastPage: Math.ceil(total / take) };
  }

  async findOne(id: number) {
    const snippet = await this.prisma.snippet.findUnique({
      where: { id },
      include: { 
        author: { select: { name: true } },
        comments: {
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        }
      },
    });
    if (!snippet) throw new NotFoundException('Snippet não encontrado');
    return snippet;
  }

  async findRandom() {
    const result = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM "Snippet" ORDER BY RANDOM() LIMIT 1;`
    );
    const snippet = Array.isArray(result) ? result[0] : null;
    return snippet;
  }

  async findSnippetOfDay() {
    const count = await this.prisma.snippet.count();
    if (count === 0) return null;
    
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const skip = dayOfYear % count;

    return this.prisma.snippet.findFirst({
      skip: skip,
      include: { author: { select: { name: true } } },
    });
  }

  async update(id: number, userId: number, dto: UpdateSnippetDto) {
    const snippet = await this.prisma.snippet.findUnique({ where: { id } });
    
    if (!snippet) throw new NotFoundException('Snippet não encontrado');
    
    if (snippet.authorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este snippet');
    }
    
    return this.prisma.snippet.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number) {
    const snippet = await this.prisma.snippet.findUnique({ where: { id } });

    if (!snippet) throw new NotFoundException('Snippet não encontrado');

    if (snippet.authorId !== userId) {
      throw new ForbiddenException('Você não tem permissão para remover este snippet');
    }

    return this.prisma.snippet.delete({ where: { id } });
  }

  async exportBatch() {
    return this.prisma.snippet.findMany({
      include: { author: { select: { name: true } } }
    });
  }
}