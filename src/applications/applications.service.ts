import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createApplicationDto: CreateApplicationDto) {
    const { job_posting_id, user_id, resume_url, cover_letter } =
      createApplicationDto;
    const query = `
      INSERT INTO applications(job_posting_id, user_id, resume_url, cover_letter)
      VALUES($1, $2, $3, $4) RETURNING *
    `;
    const values = [job_posting_id, user_id, resume_url, cover_letter];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM applications');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM applications WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {
    const { job_posting_id, user_id, resume_url, cover_letter, status } =
      updateApplicationDto;
    const query = `
      UPDATE applications 
      SET job_posting_id = COALESCE($1, job_posting_id),
          user_id = COALESCE($2, user_id),
          resume_url = COALESCE($3, resume_url),
          cover_letter = COALESCE($4, cover_letter),
          status = COALESCE($5, status),
          updated_at = NOW()
      WHERE id = $6 RETURNING *
    `;
    const values = [
      job_posting_id,
      user_id,
      resume_url,
      cover_letter,
      status,
      id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM applications WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
