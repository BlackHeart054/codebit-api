import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

jest.mock('bcrypt');

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(() => 'mocked_token'),
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar um token se as credenciais forem válidas', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed_password', name: 'Test' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({ email: 'test@test.com', password: 'password' });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(result).toEqual({ access_token: 'mocked_token' });
    });

    it('deve lançar UnauthorizedException se o usuário não existir', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@test.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se a senha estiver errada', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      
      const mockUser = { id: 1, email: 'test@test.com', password: 'hashed_password' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('deve criar um novo usuário se o e-mail não existir', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_pass');
      
      const dto = { email: 'new@test.com', password: '123', name: 'New User' };
      const createdUserFromDb = { 
        id: 1, 
        email: dto.email, 
        name: dto.name, 
        password: 'new_hashed_pass', 
        createdAt: new Date() 
      };
      
      prisma.user.create.mockResolvedValue(createdUserFromDb);

      const result = await service.register(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(prisma.user.create).toHaveBeenCalled();
      
      expect(result).toEqual({
        id: createdUserFromDb.id,
        name: createdUserFromDb.name,
        email: createdUserFromDb.email,
        createdAt: createdUserFromDb.createdAt
      });
      expect(result).not.toHaveProperty('password');
    });

    it('deve lançar ConflictException se o e-mail já existir', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'existe@test.com' });

      const dto = { email: 'existe@test.com', password: '123', name: 'User' };

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });
});