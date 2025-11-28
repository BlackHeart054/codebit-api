import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
    description: 'Token JWT para autenticação nas rotas protegidas' 
  })
  access_token: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'João Desenvolvedor' })
  name: string;

  @ApiProperty({ example: 'dev@codebit.com' })
  email: string;

  @ApiProperty({ example: '2023-10-27T10:00:00.000Z' })
  createdAt: Date;
}