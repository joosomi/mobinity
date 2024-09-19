import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { LoginDto } from '../users/dto/login.dto';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'john_doe',
      password: 'strong_password_123',
    };

    const mockUser: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'john_doe',
      email: 'example@example.com',
      password: 'hashed_password', //해쉬된 비밀번호
      hashPassword: jest.fn(),
      userType: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    //유효하지 않은 계정명인 경우
    it('계정명이 존재하지 않으면 UnauthorizedException 에러 반환', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: loginDto.username },
        select: ['id', 'username', 'email', 'password'],
      });
    });

    // 비밀번호가 일치하지 않을 경우
    it('비밀번호가 일치하지 않으면 UnauthorizedException 에러 반환', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: loginDto.username },
        select: ['id', 'username', 'email', 'password'],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });

    // 로그인 성공 시 액세스 토큰 반환
    it('로그인에 성공하면 액세스 토큰을 반환합니다.', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // 비밀번호가 일치하는 경우

      const mockAccessToken = 'mock.access.token';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken); // 액세스 토큰 생성

      const result = await service.login(loginDto);

      expect(result).toEqual({ accessToken: mockAccessToken });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { username: loginDto.username },
        select: ['id', 'username', 'email', 'password'],
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
    });
  });
});
