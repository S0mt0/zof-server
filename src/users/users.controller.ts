import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { Multer } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UpdateProfileDto, CreateUserDto, ChangePasswordDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  @Post('register')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const response = await this.usersService.createUser(createUserDto);

    res.setHeader('Authorization', response.token); // Set token in headers
    return res.status(201).json({
      success: response.success,
      message: response.message,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(
    @Req()
    request,
  ) {
    return {
      success: true,
      user: request.user,
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  // async updateProfile(
  //   @Req() request,
  //   // @UploadedFile() file: Multer.File,
  //   @Body() updateProfileDto: UpdateProfileDto,
  // ) {
  //   const user = request.user as any; // Extract user from JWT

  //   let avatarUrl = user.avatarUrl;

  //   if (file) {
  //     avatarUrl = await this.cloudinaryService.uploadImage(file);

  //     // Delete old avatar if a new one is uploaded
  //     if (user.avatarUrl) {
  //       await this.cloudinaryService.deleteImage(user.avatarUrl);
  //     }
  //   }

  //   const updatedUser = await this.usersService.updateUserProfile(user.id, {
  //     ...updateProfileDto,
  //   });

  //   return {
  //     success: true,
  //     message: 'Profile updated successfully',
  //     data: updatedUser,
  //   };
  // }
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const user = request.user as any; // Extract user from JWT
    return await this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return '';
  }

  @Delete('email')
  async deleteByEmail(@Body() email: string) {
    return this.usersService.deleteByEmail(email);
  }
}
