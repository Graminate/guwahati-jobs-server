import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateJobAlertDto } from './dto/create-job-alert.dto';
import { UpdateJobAlertDto } from './dto/update-job-alert.dto';

@Injectable()
export class JobAlertsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createJobAlertDto: CreateJobAlertDto) {
    const { user_id, criteria } = createJobAlertDto;
    const query = `
      INSERT INTO job_alerts(user_id, criteria)
      VALUES($1, $2) RETURNING *
    `;
    const values = [user_id, criteria];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByUser(userId: number) {
    const query = `
      SELECT * FROM job_alerts
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async update(id: number, updateJobAlertDto: UpdateJobAlertDto) {
    const { user_id, criteria } = updateJobAlertDto;
    const query = `
      UPDATE job_alerts 
      SET user_id = COALESCE($1, user_id),
          criteria = COALESCE($2, criteria)
      WHERE id = $3 RETURNING *
    `;
    const values = [user_id, criteria, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM job_alerts WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
