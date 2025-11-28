import { ApiProperty } from '@nestjs/swagger';

class AuthorDto {
  @ApiProperty({ example: 'João Desenvolvedor' })
  name: string | null;
  
  @ApiProperty({ example: 'dev@codebit.com', required: false })
  email?: string;
}

export class SnippetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Algoritmo de Dijkstra' })
  title: string;

  @ApiProperty({ example: 'Python' })
  language: string;

  @ApiProperty({ example: 'def dijkstra(): ...' })
  code: string;

  @ApiProperty({ example: 'Descrição opcional...' })
  description: string | null;

  @ApiProperty({ example: ['algoritmo'] })
  tags: string[];

  @ApiProperty({ example: '2023-11-20T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;
}

export class PaginatedSnippetResponseDto {
  @ApiProperty({ type: [SnippetResponseDto] })
  data: SnippetResponseDto[];

  @ApiProperty({ example: 50 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  lastPage: number;
}