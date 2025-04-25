import { Injectable } from '@nestjs/common';
import pool from '@/config/database';
import { CreateMessageDto } from './messages.dto';

@Injectable()
export class MessagesService {
  private messageFields = 'sender_id, receiver_id, content';

  async create({ sender_id, receiver_id, content }: CreateMessageDto) {
    return (
      await pool.query(
        `INSERT INTO messages(${this.messageFields})
       VALUES($1, $2, $3) RETURNING *`,
        [sender_id, receiver_id, content],
      )
    ).rows[0];
  }

  async findByUser(userId: number) {
    return (
      await pool.query(
        `SELECT * FROM messages
       WHERE sender_id = $1 OR receiver_id = $1
       ORDER BY sent_at DESC`,
        [userId],
      )
    ).rows;
  }
}
