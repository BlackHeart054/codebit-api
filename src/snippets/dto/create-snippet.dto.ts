import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateSnippetDto {
  @ApiProperty({ 
    example: 'Algoritmo de Dijkstra em Python',
    description: 'Título descritivo do snippet (min 5 chars).'
  })
  @IsString()
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @Length(5, 100, { message: 'O título deve ter entre 5 e 100 caracteres.' })
  title: string;

  @ApiProperty({ example: 'Python' })
  @IsString()
  @IsNotEmpty({ message: 'A linguagem é obrigatória.' })
  language: string;

  @ApiProperty({ 
    example: 'def dijkstra():\n    print("Hello")',
    description: 'O código fonte propriamente dito.'
  })
  @IsString()
  @IsNotEmpty({ message: 'O código não pode estar vazio.' })
  code: string;

  @ApiProperty({ required: false, example: 'Implementação otimizada para grafos densos.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['algoritmo', 'grafo', 'pathfinding'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}