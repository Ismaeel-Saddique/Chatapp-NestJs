import { Controller, Post, Body, BadRequestException, Param, Get, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/createuser.dto';
import { User } from 'src/entity/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('signup')
  async signup(@Body()  createUserdto: CreateUserDto) {
    return this.usersService.signup(createUserdto);
  }

  @Post('login')
  async login(@Body() createUserdto: CreateUserDto) {
    const user = await this.usersService.login(createUserdto);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string): Promise<{ message: string }> {
    await this.usersService.deleteUserById(userId);
    return { message: `User with ID ${userId} has been deleted.` };
  }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.findAll(); 
  }
}

