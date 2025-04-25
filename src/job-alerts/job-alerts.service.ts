import { Injectable } from '@nestjs/common';

import pool from '@/config/database';
import { CreateJobAlertDto, UpdateJobAlertDto } from './job-alerts.dto';

@Injectable()
export class JobAlertsService {
  async create({ user_id, criteria }: CreateJobAlertDto) {
    return (
      await pool.query(
        `INSERT INTO job_alerts(user_id, criteria)
       VALUES($1, $2) RETURNING *`,
        [user_id, criteria],
      )
    ).rows[0];
  }

  async findByUser(userId: number) {
    return (
      await pool.query(
        `SELECT * FROM job_alerts
       WHERE user_id = $1
       ORDER BY created_at DESC`,
        [userId],
      )
    ).rows;
  }

  async update(id: number, { user_id, criteria }: UpdateJobAlertDto) {
    return (
      await pool.query(
        `UPDATE job_alerts 
       SET user_id = COALESCE($1, user_id),
           criteria = COALESCE($2, criteria)
       WHERE id = $3 RETURNING *`,
        [user_id, criteria, id],
      )
    ).rows[0];
  }

  async remove(id: number) {
    return (
      await pool.query('DELETE FROM job_alerts WHERE id = $1 RETURNING *', [id])
    ).rows[0];
  }
}
