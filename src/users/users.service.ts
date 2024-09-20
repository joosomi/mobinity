import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserType } from '../entities/user-type.entity';
import { User } from '../entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  /**
   * 사용자 회원가입
   * @param createUserDto
   */
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, email, password } = createUserDto;

    //계정명 중복 확인
    const existingMember = await this.userRepository.findOneBy({ username });

    if (existingMember) {
      throw new ConflictException('이미 존재하는 계정명입니다.');
    }
    //가입 이메일 중복 확인
    const existingEmail = await this.userRepository.findOneBy({ email });

    if (existingEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    //default UserType 찾기 ('BRONZE')
    const defaultUserType = await this.userTypeRepository.findOne({ where: { isDefault: true } });
    if (!defaultUserType) {
      throw new NotFoundException('현재 회원가입을 할 수 없습니다.');
    }

    // 새 User 엔티티 생성
    const newUser = this.userRepository.create({
      username,
      email,
      password,
      userType: defaultUserType,
    });

    await this.userRepository.save(newUser);
  }
}
