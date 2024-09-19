import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('사용자 회원가입이 성공적으로 진행되어야 합니다.', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        email: 'example@example.com',
        password: 'strong_password_123',
      };

      jest.spyOn(usersService, 'createUser').mockResolvedValue();

      const result = await controller.createUser(createUserDto);

      expect(result).toBeUndefined(); // 성공, 결과가 204 - undefined
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('로그인 성공시 액세스 토큰을 반환합니다.', async () => {
      const loginDto: LoginDto = {
        username: 'john_doe',
        password: 'strong_password_123',
      };

      const mockAccessToken = 'mock.access.token';
      jest.spyOn(authService, 'login').mockResolvedValue({ accessToken: mockAccessToken });

      const result = await controller.login(loginDto);

      expect(result).toEqual({ accessToken: mockAccessToken });
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
