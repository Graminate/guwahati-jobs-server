import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class NotificationsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async findByUser(userId: number) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async markAsRead(id: number) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE, created_at = NOW()
      WHERE id = $1 RETURNING *
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }
}
