import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Realizar login',
    description: 'Autentica um usuário existente e retorna um token JWT.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso.', 
    type: AuthResponseDto 
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas (e-mail ou senha incorretos).' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos.' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário criado com sucesso.', 
    type: UserResponseDto
  })
  @ApiConflictResponse({ description: 'E-mail já está em uso.' })
  @ApiBadRequestResponse({ description: 'Dados de entrada inválidos (ex: senha curta).' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}