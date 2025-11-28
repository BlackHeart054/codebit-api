import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ 
    example: 'Este algoritmo tem complexidade O(n), muito bom!',
    description: 'Conteúdo do comentário (entre 5 e 1000 caracteres).'
  })
  @IsString()
  @IsNotEmpty({ message: 'O conteúdo do comentário não pode ser vazio.' })
  @Length(5, 1000, { message: 'O comentário deve ter entre 5 e 1000 caracteres.' })
  content: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID do snippet alvo.' 
  })
  @IsNumber({}, { message: 'O ID do snippet deve ser um número.' })
  snippetId: number;
}