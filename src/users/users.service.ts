import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninDto } from './dto/signin-user.dto';
import * as bcrypt from 'bcrypt';
import { customError } from '@src/common/exceptions/customError';
import { ImagesService } from '@src/images/images.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly imagesService: ImagesService,
  ) {}

  async signup(createUserDto: CreateUserDto, image?: Express.Multer.File) {
    const { email, password } = createUserDto;

    await this.checkExistingUser(email);
    const hashedPassword = await this.hashPassword(password);

    let imageUrl: string | undefined;
    if (image) {
      imageUrl = await this.uploadUserImage(image);
    }

    return this.usersRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
      image: imageUrl,
    });
  }

  async signin(signinDto: SigninDto) {
    const { email, password } = signinDto;
    const user = await this.findUserByEmail(email);
    await this.comparePassword(password, user.password);

    return user;
  }

  async update(updateUserDto: UpdateUserDto, image?: Express.Multer.File) {
    let imageUrl: string | undefined;
    if (image) {
      imageUrl = await this.uploadUserImage(image);
    }
    const user = await this.usersRepository.updateUser({
      ...updateUserDto,
      image: imageUrl,
    });
    return this.exceptionPassword(user);
  }

  async delete(deleteUserDto: DeleteUserDto) {
    await this.usersRepository.deleteUser(deleteUserDto);
  }

  private async checkExistingUser(email: string) {
    const existingUser = await this.usersRepository.findUserByEmail(email);
    if (existingUser) {
      customError(409, '0011');
    }
  }

  private async hashPassword(password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      customError(500, '0014');
    }
  }

  private async findUserByEmail(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user) {
      customError(404, '0012');
    }
    return user;
  }

  private async comparePassword(password: string, hashedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      customError(401, '0013');
    }
    return isPasswordValid;
  }

  private async uploadUserImage(image: Express.Multer.File) {
    try {
      const imageUrl = await this.imagesService.uploadImage(image);
      return imageUrl;
    } catch (error) {
      customError(500, '0021');
    }
  }

  private async exceptionPassword(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
