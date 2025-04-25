import { Injectable } from '@nestjs/common';
import pool from '@/config/database';
import { CreateSubscriptionDto } from './subscriptions.dto';

@Injectable()
export class SubscriptionsService {
  async create({
    user_id,
    subscription_type,
    start_date,
    end_date,
    status,
  }: CreateSubscriptionDto) {
    return (
      await pool.query(
        `INSERT INTO subscriptions(user_id, subscription_type, start_date, end_date, status)
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [user_id, subscription_type, start_date, end_date, status],
      )
    ).rows[0];
  }

  async findByUser(userId: number) {
    return (
      await pool.query(
        `SELECT * FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
        [userId],
      )
    ).rows;
  }
}
