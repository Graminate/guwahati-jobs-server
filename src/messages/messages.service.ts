import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createMessageDto: CreateMessageDto) {
    const { sender_id, receiver_id, content } = createMessageDto;
    const query = `
      INSERT INTO messages(sender_id, receiver_id, content)
      VALUES($1, $2, $3) RETURNING *
    `;
    const values = [sender_id, receiver_id, content];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByUser(userId: number) {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1 OR receiver_id = $1
      ORDER BY sent_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }
}
