import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import pool from '@/config/database';

@Injectable()
export class UsersService {
  private userFields =
    'id, email, first_name, last_name, phone_number, created_at, updated_at';

  async create({
    email,
    password,
    first_name,
    last_name,
    phone_number,
  }: CreateUserDto) {
    if (!email || !password || !first_name || !last_name) {
      throw new BadRequestException('All required fields must be provided');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users(email, password, first_name, last_name, phone_number)
       VALUES($1, $2, $3, $4, $5) 
       RETURNING id, email, first_name, last_name, phone_number, created_at, updated_at`,
        [email, hashedPassword, first_name, last_name, phone_number || null],
      );

      if (!result.rows[0]) {
        throw new InternalServerErrorException('User creation failed');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Database Error:', error);
      if (error.code === '23505') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll() {
    return (await pool.query(`SELECT ${this.userFields} FROM users`)).rows;
  }

  async findOne(id: number) {
    const user = (
      await pool.query(`SELECT ${this.userFields} FROM users WHERE id = $1`, [
        id,
      ])
    ).rows[0];
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(
    id: number,
    { email, first_name, last_name, phone_number }: UpdateUserDto,
  ) {
    try {
      const result = await pool.query(
        `UPDATE users SET 
        email = COALESCE($1, email),
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        phone_number = COALESCE($4, phone_number),
        updated_at = NOW()
       WHERE id = $5 RETURNING ${this.userFields}`,
        [email, first_name, last_name, phone_number, id], // Now correctly mapped
      );
      if (!result.rows[0])
        throw new NotFoundException(`User with ID ${id} not found`);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Email already exists.');
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Failed to update user.');
    }
  }

  async remove(id: number) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING ${this.userFields.replace(', created_at, updated_at', '')}`,
      [id],
    );
    if (!result.rows[0])
      throw new NotFoundException(`User with ID ${id} not found`);
    return result.rows[0];
  }
}
