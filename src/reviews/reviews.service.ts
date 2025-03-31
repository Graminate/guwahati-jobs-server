import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createReviewDto: CreateReviewDto) {
    const { user_id, company_id, rating, review_text } = createReviewDto;
    const query = `
      INSERT INTO reviews(user_id, company_id, rating, review_text)
      VALUES($1, $2, $3, $4) RETURNING *
    `;
    const values = [user_id, company_id, rating, review_text];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByCompany(companyId: number) {
    const query = `
      SELECT * FROM reviews
      WHERE company_id = $1
      ORDER BY created_at DESC
    `;
    const result = await this.pool.query(query, [companyId]);
    return result.rows;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const { user_id, company_id, rating, review_text } = updateReviewDto;
    const query = `
      UPDATE reviews 
      SET user_id = COALESCE($1, user_id),
          company_id = COALESCE($2, company_id),
          rating = COALESCE($3, rating),
          review_text = COALESCE($4, review_text)
      WHERE id = $5 RETURNING *
    `;
    const values = [user_id, company_id, rating, review_text, id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
