import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password, first_name, last_name, role } = createUserDto;
    const query = `
      INSERT INTO users(email, password, first_name, last_name, role)
      VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [email, password, first_name, last_name, role];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM users');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [
      id,
    ]);
    return result.rows[0];
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, first_name, last_name, role } = updateUserDto;
    const query = `
      UPDATE users 
      SET email = COALESCE($1, email),
          first_name = COALESCE($2, first_name),
          last_name = COALESCE($3, last_name),
          role = COALESCE($4, role),
          updated_at = NOW()
      WHERE id = $5 RETURNING *
    `;
    const values = [email, first_name, last_name, role, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
