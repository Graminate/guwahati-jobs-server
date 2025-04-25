import { Injectable } from '@nestjs/common';

import pool from '@/config/database';
import { CreateApplicationDto, UpdateApplicationDto } from './applications.dto';

@Injectable()
export class ApplicationsService {
  private applicationFields =
    'job_posting_id, user_id, resume_url, cover_letter, status';

  async create({
    job_posting_id,
    user_id,
    resume_url,
    cover_letter,
  }: CreateApplicationDto) {
    return (
      await pool.query(
        `INSERT INTO applications(${this.applicationFields})
       VALUES($1, $2, $3, $4, 'submitted') RETURNING *`,
        [job_posting_id, user_id, resume_url, cover_letter],
      )
    ).rows[0];
  }

  async findAll() {
    return (await pool.query('SELECT * FROM applications')).rows;
  }

  async findOne(id: number) {
    return (await pool.query('SELECT * FROM applications WHERE id = $1', [id]))
      .rows[0];
  }

  async update(
    id: number,
    {
      job_posting_id,
      user_id,
      resume_url,
      cover_letter,
      status,
    }: UpdateApplicationDto,
  ) {
    return (
      await pool.query(
        `UPDATE applications SET
        job_posting_id = COALESCE($1, job_posting_id),
        user_id = COALESCE($2, user_id),
        resume_url = COALESCE($3, resume_url),
        cover_letter = COALESCE($4, cover_letter),
        status = COALESCE($5, status),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
        [job_posting_id, user_id, resume_url, cover_letter, status, id],
      )
    ).rows[0];
  }

  async remove(id: number) {
    return (
      await pool.query('DELETE FROM applications WHERE id = $1 RETURNING *', [
        id,
      ])
    ).rows[0];
  }
}
