import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'Esse código salvou meu dia!' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 1, description: 'ID do Snippet onde será feito o comentário' })
  @IsNumber()
  snippetId: number;
}