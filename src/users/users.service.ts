import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const checkUsername = await this.prisma.user.count({
        where: {
          username: createUserDto.username,
        },
      });

      if (checkUsername !== 0) {
        throw new HttpException('user already exist', 400);
      }

      const checkEmail = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (checkEmail) {
        throw new HttpException('email can`t be same', 400);
      }

      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: createUserDto.password,
        },
      });

      console.log(user);

      return {
        username: user.username,
        email: user.email,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        console.error(e);
        throw new HttpException(e.message, 400);
      }

      if (e instanceof Error) {
        console.error(e);
        throw new HttpException('Internal Server Error', 500);
      }
    }
  }

  async findAll() {
    try {
      const user = await this.prisma.user.findMany();

      if (user.length === 0) {
        throw new HttpException('User not found', 404);
      }

      return user;
    } catch (e) {
      if (e instanceof Error) {
        console.error(e);
        throw new HttpException('Internal Server Error', 500);
      }

      if (e instanceof HttpException) {
        console.error(e);
        throw new HttpException(e.message, 400);
      }
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
