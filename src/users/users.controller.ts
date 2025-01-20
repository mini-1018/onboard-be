import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signup(createUserDto);
  }

  @Post('/signin')
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const user = await this.usersService.signin(signinDto);
    console.log(user);
    return res.status(200).send(user);
  }

  @Post('/signout')
  signout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(204).send();
  }
}
