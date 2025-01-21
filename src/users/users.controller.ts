import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { multerOptions } from '@src/common/utils/multer/multer.utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @UseInterceptors(
    FileInterceptor('image', {
      ...multerOptions,
      storage: memoryStorage(),
    }),
  )
  async signup(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.usersService.signup(createUserDto, image);
    return res.status(200).send();
  }

  @Post('/signin')
  async signin(@Body() signinDto: SigninDto, @Res() res: Response) {
    const user = await this.usersService.signin(signinDto);
    return res.status(200).send(user);
  }

  @Post('/signout')
  signout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(204).send();
  }
}
