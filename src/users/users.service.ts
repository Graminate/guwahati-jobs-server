import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,

    });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, first_name, last_name, role, phone_number } =
      createUserDto;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users(email, password, first_name, last_name, role, phone_number)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, role, phone_number, created_at, updated_at
    `;
    const values = [
      email,
      hashedPassword,
      first_name,
      last_name,
      role,
      phone_number,
    ];

    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        throw new InternalServerErrorException(
          'User creation failed unexpectedly.',
        );
      }
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        throw new ConflictException('Email already exists.');
      }
      console.error('Error creating user in DB:', error);
      throw new InternalServerErrorException(
        'Failed to create user due to database error.',
      );
    }
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT id, email, first_name, last_name, role, phone_number, created_at, updated_at FROM users',
    );
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT id, email, first_name, last_name, role, phone_number, created_at, updated_at FROM users WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result.rows[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, first_name, last_name, role, phone_number } = updateUserDto;
    const query = `
      UPDATE users
      SET email = COALESCE($1, email),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          role = COALESCE($4, role),
          phone_number = COALESCE($5, phone_number),
          updated_at = NOW()
      WHERE id = $6
      RETURNING id, email, first_name, last_name, role, phone_number, created_at, updated_at
    `;
    const values = [email, first_name, last_name, role, phone_number, id];

    try {
      const result = await this.pool.query(query, values);
      if (result.rows.length === 0) {
        throw new NotFoundException(`User with ID ${id} not found for update`);
      }
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        throw new ConflictException('Email already exists.');
      }
      console.error(`Error updating user ${id}:`, error);
      throw new InternalServerErrorException('Failed to update user.');
    }
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email, first_name, last_name, role, phone_number',
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException(`User with ID ${id} not found for deletion`);
    }
    return result.rows[0];
  }
}
