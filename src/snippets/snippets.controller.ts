import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe, Res } from '@nestjs/common';
import { SnippetsService } from './snippets.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { UpdateSnippetDto } from './dto/update-snippet.dto';

@ApiTags('Snippets')
@Controller('snippets')
export class SnippetsController {
  constructor(private readonly snippetsService: SnippetsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo snippet' })
  create(@Request() req, @Body() createSnippetDto: CreateSnippetDto) {
    return this.snippetsService.create(req.user.userId, createSnippetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar snippets com filtros' })
  @ApiQuery({ name: 'language', required: false })
  @ApiQuery({ name: 'tag', required: false })
  @ApiQuery({ name: 'page', required: false })
  findAll(
    @Query('language') language?: string,
    @Query('tag') tag?: string,
    @Query('page') page: string = '1',
  ) {
    return this.snippetsService.findAll(language, tag, +page);
  }

  @Get('random')
  @ApiOperation({ summary: 'Retorna um snippet aleatório' })
  findRandom() {
    return this.snippetsService.findRandom();
  }

  @Get('daily')
  @ApiOperation({ summary: 'Retorna o snippet do dia' })
  findDaily() {
    return this.snippetsService.findSnippetOfDay();
  }

  @Get('export')
  @ApiOperation({ summary: 'Download em lote (JSON)' })
  async export(@Res() res: Response) {
    const data = await this.snippetsService.exportBatch();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=snippets.json');
    res.send(JSON.stringify(data, null, 2));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.snippetsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar snippet' })
  update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() updateSnippetDto: UpdateSnippetDto) {
    return this.snippetsService.update(id, req.user.userId, updateSnippetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover snippet' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.snippetsService.remove(id, req.user.userId);
  }
}