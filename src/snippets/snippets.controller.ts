import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { UpdateSnippetDto } from './dto/update-snippet.dto';
import { SnippetResponseDto, PaginatedSnippetResponseDto } from './dto/snippet-response.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('Snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo snippet' })
  @ApiResponse({ status: 201, description: 'Snippet criado com sucesso.', type: SnippetResponseDto })
  @ApiUnauthorizedResponse({ description: 'Usuário não autenticado.' })
  create(@Request() req, @Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(req.user.userId, createSnippetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar snippets (Paginado)' })
  @ApiResponse({ status: 200, description: 'Lista paginada de snippets.', type: PaginatedSnippetResponseDto })
  @ApiQuery({ name: 'language', required: false, description: 'Filtrar por linguagem (ex: Python)' })
  @ApiQuery({ name: 'tag', required: false, description: 'Filtrar por tag (ex: algoritmo)' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página (Padrão: 1)' })
  findAll(
    @Query('language') language?: string,
    @Query('tag') tag?: string,
    @Query('page') page: string = '1',
  ) {
    return this.snippetsService.findAll(language, tag, +page);
  }

  @Get('random')
  @ApiOperation({ summary: 'Retorna um snippet aleatório' })
  @ApiResponse({ status: 200, type: SnippetResponseDto })
  findRandom() {
    return this.snippetsService.findRandom();
  }

  @Get('daily')
  @ApiOperation({ summary: 'Retorna o snippet do dia' })
  @ApiResponse({ status: 200, type: SnippetResponseDto })
  findDaily() {
    return this.snippetsService.findSnippetOfDay();
  }

  @Get('export')
  @ApiOperation({ summary: 'Download em lote (JSON)' })
  @ApiResponse({ status: 200, description: 'Arquivo JSON para download.' })
  async export(@Res() res: Response) {
    const data = await this.snippetsService.exportBatch();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=snippets.json');
    res.send(JSON.stringify(data, null, 2));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar por ID (com comentários)' })
  @ApiResponse({ status: 200, type: SnippetResponseDto })
  @ApiNotFoundResponse({ description: 'Snippet não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar snippet' })
  @ApiResponse({ status: 200, type: SnippetResponseDto })
  @ApiNotFoundResponse({ description: 'Snippet não encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(id, req.user.userId, updateSnippetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover snippet' })
  @ApiResponse({ status: 200, description: 'Snippet removido.' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.snippetsService.remove(id, req.user.userId);
  }
}