import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetPostsDto } from '@src/posts/dto/get-posts.dto';
import { PostsService } from '@src/posts/posts.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

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

  @Patch('/update')
  @UseInterceptors(
    FileInterceptor('image', {
      ...multerOptions,
      storage: memoryStorage(),
    }),
  )
  async update(
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const user = await this.usersService.update(updateUserDto, image);
    return res.status(200).send(user);
  }

  @Delete('/delete')
  async delete(@Body() deleteUserDto: DeleteUserDto, @Res() res: Response) {
    await this.usersService.delete(deleteUserDto);
    return res.status(200).send();
  }

  @Get(':userId/posts')
  getPostsByUserId(
    @Param('userId') userId: string,
    @Query() query: GetPostsDto,
  ) {
    console.log(userId);
    console.log(query);
    return this.postsService.getPostsByUserId(+userId, query);
  }
}
