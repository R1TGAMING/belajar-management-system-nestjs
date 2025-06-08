import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const res = await this.usersService.create(createUserDto);

      return {
        status: HttpStatus.CREATED,
        message: 'success',
        data: res,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        throw e;
      }
    }
  }

  @Get()
  async findAll() {
    try {
      const res = await this.usersService.findAll();
      return {
        status: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        throw e;
      }
    }
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    try {
      const res = await this.usersService.findOne(email);
      return {
        status: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        throw e;
      }
    }
  }

  @Patch(':email')
  async update(
    @Param('email') email: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const res = await this.usersService.update(email, updateUserDto);
      return {
        status: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw e;
      }

      if (e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        throw e;
      }
    }
  }

  @Delete(':email')
  async remove(@Param('email') email: string) {
    try {
      const res = await this.usersService.remove(email);
      return {
        status: HttpStatus.OK,
        message: 'success',
        data: res,
      };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw e;
      }

      if (e instanceof HttpException) {
        throw e;
      }

      if (e instanceof Error) {
        throw e;
      }
    }
  }
}
