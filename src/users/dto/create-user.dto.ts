import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '계정명', example: 'john_doe' })
  @IsNotEmpty({ message: '계정명은 비워둘 수 없습니다.' })
  @Matches(/^[a-zA-Z0-9_]{4,20}$/, {
    message: '계정명은 4~20자 사이의 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다.',
  })
  @IsString()
  username: string;

  @ApiProperty({ description: '이메일 주소', example: 'example@example.com' })
  @IsEmail({}, { message: '올바른 이메일 형식을 사용해야 합니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'strong_password_123' })
  @IsNotEmpty({ message: '비밀번호는 비워둘 수 없습니다.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&_]{6,}$/, {
    message:
      '비밀번호는 최소 6자 이상이며, 영문자, 숫자, 특수문자(@$!%*?&_ 중 하나)를 포함해야 합니다.',
  })
  @IsString()
  password: string;
}
