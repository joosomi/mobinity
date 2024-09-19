import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserType } from '../entities/user-type.entity';
import { User } from '../entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let userTypeRepository: Repository<UserType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // User 엔티티  Mock
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          // UserType 엔티티 Mock
          provide: getRepositoryToken(UserType),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userTypeRepository = module.get<Repository<UserType>>(getRepositoryToken(UserType));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      username: 'john_doe',
      email: 'example@example.comm',
      password: 'strong_password_123',
    };

    const mockUserType: UserType = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'BRONZE',
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(userTypeRepository, 'findOne').mockResolvedValue(mockUserType);
    });

    it('계정명이 이미 존재할 경우 ConflictException 에러 반환', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValueOnce({
        id: '123e4567-e89b-12d3-a456-426614174001',
        username: 'john_doe',
      } as User);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ username: 'john_doe' });
    });

    it('이메일이 이미 존재할 경우 ConflictException 에러 반환', async () => {
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: '123e4567-e89b-12d3-a456-426614174002',
          email: 'example@example.com',
        } as User);

      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(userRepository.findOneBy).toHaveBeenNthCalledWith(1, { username: 'john_doe' });
      expect(userRepository.findOneBy).toHaveBeenNthCalledWith(2, {
        email: 'example@example.comm',
      });
    });

    it('default UserType(BRONZE)이 없을 경우 NotFoundException 에러 반환', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userTypeRepository, 'findOne').mockResolvedValue(null); // 기본 UserType 없음

      await expect(service.createUser(createUserDto)).rejects.toThrow(NotFoundException);
      expect(userRepository.findOneBy).toHaveBeenCalledTimes(2); // 계정명, 이메일 체크 두 번 확인
      expect(userTypeRepository.findOne).toHaveBeenCalledWith({ where: { isDefault: true } });
    });

    it('새로운 사용자가 성공적으로 생성되어야 합니다.', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const mockNewUser: User = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        ...createUserDto,
        userType: mockUserType,
        hashPassword: jest.fn(), //hashPassword 메서드 mock으로 포함시켜야 함
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userRepository, 'create').mockReturnValue(mockNewUser);
      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(mockNewUser);

      await service.createUser(createUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledTimes(2);
      expect(userTypeRepository.findOne).toHaveBeenCalledWith({ where: { isDefault: true } });
      expect(userRepository.create).toHaveBeenCalledWith({
        username: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        userType: mockUserType,
      });
      expect(saveSpy).toHaveBeenCalledWith(mockNewUser);
    });
  });
});
