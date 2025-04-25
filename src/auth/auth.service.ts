import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../users/users.dto';
import { UsersService } from '../users/users.service';
import pool from '@/config/database';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
      const user = result.rows[0];

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '3d' },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return { token, user: userWithoutPassword };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login error:', error);
      throw new InternalServerErrorException('Login failed');
    }
  }
}
