import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateSavedJobDto } from './dto/create-saved-job.dto';

@Injectable()
export class SavedJobsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createSavedJobDto: CreateSavedJobDto) {
    const { user_id, job_posting_id } = createSavedJobDto;
    const query = `
      INSERT INTO saved_jobs(user_id, job_posting_id)
      VALUES($1, $2) RETURNING *
    `;
    const values = [user_id, job_posting_id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByUser(userId: number) {
    const query = `
      SELECT * FROM saved_jobs
      WHERE user_id = $1
      ORDER BY saved_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM saved_jobs WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
