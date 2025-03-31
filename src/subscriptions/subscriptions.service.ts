import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const { user_id, subscription_type, start_date, end_date, status } =
      createSubscriptionDto;
    const query = `
      INSERT INTO subscriptions(user_id, subscription_type, start_date, end_date, status)
      VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [user_id, subscription_type, start_date, end_date, status];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByUser(userId: number) {
    const query = `
      SELECT * FROM subscriptions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }
}
