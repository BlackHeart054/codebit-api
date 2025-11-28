import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Comentar em um snippet',
    description: 'Cria um novo comentário vinculado a um snippet existente.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Comentário criado com sucesso.', 
    type: CommentResponseDto 
  })
  @ApiNotFoundResponse({ description: 'Snippet não encontrado com o ID fornecido.' })
  @ApiUnauthorizedResponse({ description: 'Usuário não autenticado.' })
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(req.user.userId, createCommentDto);
  }

  @Get('snippet/:snippetId')
  @ApiOperation({ 
    summary: 'Listar comentários',
    description: 'Retorna todos os comentários de um snippet específico, ordenados do mais recente para o mais antigo.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de comentários retornada.', 
    type: [CommentResponseDto] 
  })
  findBySnippet(@Param('snippetId', ParseIntPipe) snippetId: number) {
    return this.commentsService.findBySnippet(snippetId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Remover comentário',
    description: 'Apaga um comentário. Apenas o autor do comentário pode excluí-lo.'
  })
  @ApiResponse({ status: 204, description: 'Comentário removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Comentário não encontrado ou você não tem permissão.' })
  @ApiUnauthorizedResponse({ description: 'Usuário não autenticado.' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.commentsService.remove(id, req.user.userId);
  }
}