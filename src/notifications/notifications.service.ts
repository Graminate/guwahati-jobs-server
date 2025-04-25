import { Injectable } from '@nestjs/common';
import pool from '@/config/database';

@Injectable()
export class NotificationsService {
  async findByUser(userId: number) {
    return (
      await pool.query(
        `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
        [userId],
      )
    ).rows;
  }

  async markAsRead(id: number) {
    return (
      await pool.query(
        `UPDATE notifications
       SET is_read = TRUE, read_at = NOW()
       WHERE id = $1 RETURNING *`,
        [id],
      )
    ).rows[0];
  }
}
