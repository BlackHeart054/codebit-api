import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateCommentDto) {
    const snippet = await this.prisma.snippet.findUnique({ where: { id: dto.snippetId } });
    if (!snippet) throw new NotFoundException('Snippet não encontrado');

    return this.prisma.comment.create({
      data: {
        content: dto.content,
        snippetId: dto.snippetId,
        userId: userId,
      },
      include: { user: { select: { name: true } } }
    });
  }

  async findBySnippet(snippetId: number) {
    return this.prisma.comment.findMany({
      where: { snippetId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async remove(id: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.userId !== userId) throw new NotFoundException('Não permitido');

    return this.prisma.comment.delete({ where: { id } });
  }
}