import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar comentário a um snippet' })
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req.user.userId, createCommentDto);
  }

  @Get('snippet/:snippetId')
  @ApiOperation({ summary: 'Listar comentários de um snippet' })
  findBySnippet(@Param('snippetId', ParseIntPipe) snippetId: number) {
    return this.commentsService.findBySnippet(snippetId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar comentário' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.commentsService.remove(id, req.user.userId);
  }
}