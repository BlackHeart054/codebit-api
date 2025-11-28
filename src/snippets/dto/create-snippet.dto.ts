import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSnippetDto {
  @ApiProperty({ example: 'Algoritmo de Dijkstra' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Python' })
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ example: 'def dijkstra(): ...' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['algoritmo', 'grafo'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}