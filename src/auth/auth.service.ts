import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from 'src/users/users.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);

      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error during registration delegation:', error);
      throw new InternalServerErrorException(
        'Registration failed due to an unexpected error.',
      );
    }
  }

  async login(email: string, password: string) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const query = 'SELECT * FROM users WHERE email = $1';
    let user;
    try {
      const result = await pool.query(query, [email]);
      user = result.rows[0];
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      throw new InternalServerErrorException(
        'Login failed due to a database error.',
      );
    } finally {
      await pool.end();
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}
