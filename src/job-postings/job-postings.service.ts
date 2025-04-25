import { Injectable } from '@nestjs/common';
import pool from '@/config/database';
import { CreateJobPostingDto, UpdateJobPostingDto } from './job-postings.dto';

@Injectable()
export class JobPostingsService {
  private jobPostingFields = `
    company_id, title, description, requirements, salary_range, 
    location, employment_type, benefits, expires_at, is_featured
  `;

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

    return (
      await pool.query(
        `INSERT INTO job_postings(${this.jobPostingFields})
       VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
        [
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
        ],
      )
    ).rows[0];
  }

  async findAll() {
    return (await pool.query('SELECT * FROM job_postings')).rows;
  }

  async findOne(id: number) {
    return (await pool.query('SELECT * FROM job_postings WHERE id = $1', [id]))
      .rows[0];
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

    return (
      await pool.query(
        `UPDATE job_postings SET
        company_id = COALESCE($1, company_id),
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
       WHERE id = $11 RETURNING *`,
        [
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
        ],
      )
    ).rows[0];
  }

  async remove(id: number) {
    return (
      await pool.query('DELETE FROM job_postings WHERE id = $1 RETURNING *', [
        id,
      ])
    ).rows[0];
  }
}
