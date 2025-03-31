import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password, first_name, last_name, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users(email, password, first_name, last_name, role)
      VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [email, hashedPassword, first_name, last_name, role];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async login(email: string, password: string) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email]);
    const user = result.rows[0];
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Generate a JWT token; adjust secret and options as needed.
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' },
    );
    return { token };
  }
}
