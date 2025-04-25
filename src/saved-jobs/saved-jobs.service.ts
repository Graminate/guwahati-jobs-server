import { Injectable } from '@nestjs/common';
import pool from '@/config/database';
import { CreateSavedJobDto } from './saved-jobs.dto';

@Injectable()
export class SavedJobsService {
  async create({ user_id, job_posting_id }: CreateSavedJobDto) {
    return (
      await pool.query(
        `INSERT INTO saved_jobs(user_id, job_posting_id)
       VALUES($1, $2) RETURNING *`,
        [user_id, job_posting_id],
      )
    ).rows[0];
  }

  async findByUser(userId: number) {
    return (
      await pool.query(
        `SELECT * FROM saved_jobs
       WHERE user_id = $1
       ORDER BY saved_at DESC`,
        [userId],
      )
    ).rows;
  }

  async remove(id: number) {
    return (
      await pool.query('DELETE FROM saved_jobs WHERE id = $1 RETURNING *', [id])
    ).rows[0];
  }
}
