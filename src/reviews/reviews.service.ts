import { Injectable } from '@nestjs/common';

import pool from '@/config/database';
import { CreateReviewDto, UpdateReviewDto } from './reviews.dto';

@Injectable()
export class ReviewsService {
  private reviewFields = 'user_id, company_id, rating, review_text';

  async create({ user_id, company_id, rating, review_text }: CreateReviewDto) {
    return (
      await pool.query(
        `INSERT INTO reviews(${this.reviewFields})
       VALUES($1, $2, $3, $4) RETURNING *`,
        [user_id, company_id, rating, review_text],
      )
    ).rows[0];
  }

  async findByCompany(companyId: number) {
    return (
      await pool.query(
        `SELECT * FROM reviews
       WHERE company_id = $1
       ORDER BY created_at DESC`,
        [companyId],
      )
    ).rows;
  }

  async update(
    id: number,
    { user_id, company_id, rating, review_text }: UpdateReviewDto,
  ) {
    return (
      await pool.query(
        `UPDATE reviews SET
        user_id = COALESCE($1, user_id),
        company_id = COALESCE($2, company_id),
        rating = COALESCE($3, rating),
        review_text = COALESCE($4, review_text)
       WHERE id = $5 RETURNING *`,
        [user_id, company_id, rating, review_text, id],
      )
    ).rows[0];
  }

  async remove(id: number) {
    return (
      await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id])
    ).rows[0];
  }
}
