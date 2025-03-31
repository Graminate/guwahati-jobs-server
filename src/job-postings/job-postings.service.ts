import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateJobPostingDto } from './dto/create-job-posting.dto';
import { UpdateJobPostingDto } from './dto/update-job-posting.dto';

@Injectable()
export class JobPostingsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createJobPostingDto: CreateJobPostingDto) {
    const {
      company_id,
      title,
      description,
      requirements,
      salary_range,
      location,
      employment_type,
      benefits,
      expires_at,
      is_featured,
    } = createJobPostingDto;
    const query = `
      INSERT INTO job_postings(company_id, title, description, requirements, salary_range, location, employment_type, benefits, expires_at, is_featured)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    `;
    const values = [
      company_id,
      title,
      description,
      requirements,
      salary_range,
      location,
      employment_type,
      benefits,
      expires_at,
      is_featured,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM job_postings');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM job_postings WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  async update(id: number, updateJobPostingDto: UpdateJobPostingDto) {
    const {
      company_id,
      title,
      description,
      requirements,
      salary_range,
      location,
      employment_type,
      benefits,
      expires_at,
      is_featured,
    } = updateJobPostingDto;
    const query = `
      UPDATE job_postings 
      SET company_id = COALESCE($1, company_id),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          requirements = COALESCE($4, requirements),
          salary_range = COALESCE($5, salary_range),
          location = COALESCE($6, location),
          employment_type = COALESCE($7, employment_type),
          benefits = COALESCE($8, benefits),
          expires_at = COALESCE($9, expires_at),
          is_featured = COALESCE($10, is_featured),
          updated_at = NOW()
      WHERE id = $11 RETURNING *
    `;
    const values = [
      company_id,
      title,
      description,
      requirements,
      salary_range,
      location,
      employment_type,
      benefits,
      expires_at,
      is_featured,
      id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM job_postings WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
