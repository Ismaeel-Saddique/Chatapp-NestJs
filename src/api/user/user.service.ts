import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'
import { CreateUserDto } from 'src/dtos/createuser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  private readonly jwtsecret = 'JWTSECRET';
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService) { }

  async signup(createuserdto: CreateUserDto): Promise<User> {
    const { username, password } = createuserdto
    const existingUser = await this.userRepository.findOne({ where: { username } });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(newUser);
  }

  async login(createuserdto: CreateUserDto) {
    const { username, password} = createuserdto;
    const user = await this.userRepository.findOne({ where: { username } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, userid : user.userId};
    const accessToken = await this.jwtService.signAsync(payload);
    return { user, accessToken };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtsecret);
      return decoded; 
    } catch (err) {
      return null; 
    }
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: {userId} });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId}} not found`);
    }
    return user;
  }

  async deleteUserById(userId: string): Promise<void> {
    const result = await this.userRepository.delete(userId);
    
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

}

