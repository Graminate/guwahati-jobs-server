import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createInterviewDto: CreateInterviewDto) {
    const {
      application_id,
      interview_date,
      interview_status,
      location,
      notes,
    } = createInterviewDto;
    const query = `
      INSERT INTO interviews(application_id, interview_date, interview_status, location, notes)
      VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [
      application_id,
      interview_date,
      interview_status || 'Scheduled',
      location,
      notes,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM interviews');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM interviews WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  async update(id: number, updateInterviewDto: UpdateInterviewDto) {
    const {
      application_id,
      interview_date,
      interview_status,
      location,
      notes,
    } = updateInterviewDto;
    const query = `
      UPDATE interviews 
      SET application_id = COALESCE($1, application_id),
          interview_date = COALESCE($2, interview_date),
          interview_status = COALESCE($3, interview_status),
          location = COALESCE($4, location),
          notes = COALESCE($5, notes)
      WHERE id = $6 RETURNING *
    `;
    const values = [
      application_id,
      interview_date,
      interview_status,
      location,
      notes,
      id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}
