import { ApiProperty } from '@nestjs/swagger';

class CommentAuthorDto {
  @ApiProperty({ example: 'Maria Developer' })
  name: string | null;
}

export class CommentResponseDto {
  @ApiProperty({ example: 10 })
  id: number;

  @ApiProperty({ example: 'Este algoritmo tem complexidade O(n), muito bom!' })
  content: string;

  @ApiProperty({ example: '2023-11-20T14:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 5 })
  snippetId: number;

  @ApiProperty({ type: CommentAuthorDto })
  user: CommentAuthorDto;
}