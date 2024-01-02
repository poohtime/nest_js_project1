import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwtAuth.guard';

@UseGuards(JwtAuthGuard) // 전역으로 사용할 수 있고, 메소드에 따로 사용할 수 있음
@Controller('users') // /users/*
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getUser(@Req() req: any) {
    return this.usersService.getUserById(req.user.id);
  }

  @Get(':userId')
  getUserById(@Param('userId') userId: number) {
    return this.usersService.getUserById(userId);
  }

  @Get()
  getAllUser() {
    return this.usersService.getAllUser();
  }

  @Patch('me')
  patch(@Body() updateData: UpdateUserDto, @Req() req: any) {
    return this.usersService.updateUserPassword(req.user.id, updateData);
  }
}
