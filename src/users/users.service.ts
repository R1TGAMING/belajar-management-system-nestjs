import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

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
        throw new HttpException('User already exist', 400);
      }

      const checkEmail = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (checkEmail) {
        throw new HttpException('Email can`t be same', 400);
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

  async findOne(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user === null) {
        throw new HttpException('User not exists', 404);
      }

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

  async update(email: string, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          username: updateUserDto.username,
          email: updateUserDto.email,
          password: updateUserDto.password,
        },
      });

      return {
        username: user.username,
        email: user.email,
        password: user.password,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new HttpException('Email can`t be found', 404);
      }

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

  async remove(email: string) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          email: email,
        },
      });

      return user;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new HttpException('Email can`t be found', 404);
      }

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
}
