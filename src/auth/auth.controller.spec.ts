import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ access_token: 'token' }),
  register: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com' }),
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

  it('deve chamar authService.login ao fazer login', async () => {
    const dto = { email: 'test@test.com', password: '123' };
    await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
  });

  it('deve chamar authService.register ao registrar', async () => {
    const dto = { email: 'test@test.com', password: '123', name: 'User' };
    await controller.register(dto);
    expect(service.register).toHaveBeenCalledWith(dto);
  });
});