import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { HttpError } from '@src/common/exceptions/httpError';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signup(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    await this.checkExistingUser(email);
    const hashedPassword = await this.hashPassword(password);
    createUserDto.password = hashedPassword;

    return this.usersRepository.createUser(createUserDto);
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;

    const user = await this.findUserByEmail(email);
    await this.comparePassword(password, user.password);

    return user;
  }

  private async checkExistingUser(email: string) {
    const existingUser = await this.usersRepository.findUserByEmail(email);

    if (existingUser) {
      throw new HttpError(409, '이미 존재하는 이메일입니다.');
    }
  }

  private async hashPassword(password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      throw new HttpError(500, '비밀번호 암호화 실패');
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      throw new HttpError(404, '존재하지 않는 이메일입니다.');
    }
    return user;
  }

  private async comparePassword(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new HttpError(401, '비밀번호가 일치하지 않습니다.');
    }
    return isPasswordValid;
  }
}
