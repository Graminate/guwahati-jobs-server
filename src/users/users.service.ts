import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import pool from '@/config/database';

@Injectable()
export class UsersService {
  private userFields =
    'id, email, first_name, last_name, role, phone_number, created_at, updated_at';

  async create({
    email,
    password,
    first_name,
    last_name,
    role,
    phone_number,
  }: CreateUserDto) {
    try {
      const result = await pool.query(
        `INSERT INTO users(email, password, first_name, last_name, role, phone_number)
         VALUES($1, $2, $3, $4, $5, $6) RETURNING ${this.userFields}`,
        [
          email,
          await bcrypt.hash(password, 10),
          first_name,
          last_name,
          role,
          phone_number,
        ],
      );
      if (!result.rows[0])
        throw new InternalServerErrorException(
          'User creation failed unexpectedly.',
        );
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Email already exists.');
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user.');
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
    { email, first_name, last_name, role, phone_number }: UpdateUserDto,
  ) {
    try {
      const result = await pool.query(
        `UPDATE users SET 
          email = COALESCE($1, email),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          role = COALESCE($4, role),
          phone_number = COALESCE($5, phone_number),
          updated_at = NOW()
         WHERE id = $6 RETURNING ${this.userFields}`,
        [email, first_name, last_name, role, phone_number, id],
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
