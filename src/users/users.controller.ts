import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  // Delete,
  ParseIntPipe,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.usersService.createUser(createUserDto);

    res.setHeader('Authorization', response.token); // Set token in headers
    return res.status(201).json({
      success: response.success,
      message: response.message,
    });
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return '';
  // }
  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateUserDto: UpdateUserDto,
  // ) {
  //   return updateUserDto;
  // }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return '';
  }

  @Delete('email')
  async deleteByEmail(@Body() email: string) {
    return this.usersService.deleteByEmail(email);
  }
}
