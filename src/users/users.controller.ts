import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from '../auth/auth.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 사용자 회원가입
   * @param createUserDto
   * @returns void
   */
  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT) //204
  @ApiOperation({
    summary: '회원가입',
    description: `
    - 새로운 사용자 계정을 생성합니다.
    - 기본 사용자 유형인 'BRONZE' 유형으로 가입 됩니다. 기본 사용자 유형이 없다면 가입이 불가능합니다.
    - 입력된 계정명과 이메일이 이미 존재할 경우 가입이 불가능합니다.
    - 유효한 형식의 계정명, 이메일, 비밀번호를 입력해야 합니다.
    `,
  })
  @ApiResponse({ status: 204, description: '회원가입 성공' })
  @ApiResponse({
    status: 400,
    description: '계정명, 이메일, 비밀번호가 빈 값이거나, 잘못된 형식일 경우.',
  }) // 400 Bad Request 에러
  @ApiResponse({
    status: 404,
    description: 'default UserType을 찾지 못하여 회원가입이 불가능한 경우.',
  }) // 404 Not Found 에러
  @ApiResponse({ status: 409, description: '이미 존재하는 계정명, 이메일로 가입 시도' }) // 409 Conflict 에러
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.createUser(createUserDto);
  }
}
