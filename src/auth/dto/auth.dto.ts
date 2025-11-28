import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'dev@codebit.com', 
    description: 'E-mail do usuário cadastrado',
    format: 'email'
  })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido' })
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
  email: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Senha de acesso',
    minLength: 6 
  })
  @IsString()
  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ 
    example: 'João Desenvolvedor', 
    description: 'Nome completo do usuário' 
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ 
    example: 'dev@codebit.com', 
    description: 'E-mail único para login',
    format: 'email'
  })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Senha para acesso (mínimo 6 caracteres)',
    minLength: 6 
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}