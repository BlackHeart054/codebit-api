import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConflictException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ access_token: 'token_jwt_valido' }),
  register: jest.fn().mockResolvedValue({ 
    id: 1, 
    name: 'User', 
    email: 'test@test.com', 
    createdAt: new Date() 
  }),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar o token de acesso', async () => {
      const dto = { email: 'test@test.com', password: '123' };
      const result = await controller.login(dto);
      
      expect(service.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ access_token: 'token_jwt_valido' });
    });
  });

  describe('register', () => {
    it('deve registrar e retornar dados do usuário (sem senha)', async () => {
      const dto = { email: 'test@test.com', password: '123', name: 'User' };
      const result = await controller.register(dto);
      
      expect(service.register).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar erro se o service lançar ConflictException', async () => {
      service.register.mockRejectedValueOnce(new ConflictException());
      
      const dto = { email: 'existe@test.com', password: '123', name: 'User' };
      
      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });
});