import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'dev@exemplo.com' })
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'João Desenvolvedor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'dev@exemplo.com' })
  @IsEmail({}, { message: 'O e-mail deve ser válido' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}