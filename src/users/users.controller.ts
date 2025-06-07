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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
