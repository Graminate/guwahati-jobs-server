import { Injectable } from '@nestjs/common';

import pool from '@/config/database';
import { CreateInterviewDto, UpdateInterviewDto } from './interviews.dto';

@Injectable()
export class InterviewsService {
  private interviewFields =
    'application_id, interview_date, interview_status, location, notes';

  async create({
    application_id,
    interview_date,
    interview_status = 'Scheduled',
    location,
    notes,
  }: CreateInterviewDto) {
    return (
      await pool.query(
        `INSERT INTO interviews(${this.interviewFields})
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [application_id, interview_date, interview_status, location, notes],
      )
    ).rows[0];
  }

  async findAll() {
    return (await pool.query('SELECT * FROM interviews')).rows;
  }

  async findOne(id: number) {
    return (await pool.query('SELECT * FROM interviews WHERE id = $1', [id]))
      .rows[0];
  }

  async update(
    id: number,
    {
      application_id,
      interview_date,
      interview_status,
      location,
      notes,
    }: UpdateInterviewDto,
  ) {
    return (
      await pool.query(
        `UPDATE interviews SET
        application_id = COALESCE($1, application_id),
        interview_date = COALESCE($2, interview_date),
        interview_status = COALESCE($3, interview_status),
        location = COALESCE($4, location),
        notes = COALESCE($5, notes)
       WHERE id = $6 RETURNING *`,
        [application_id, interview_date, interview_status, location, notes, id],
      )
    ).rows[0];
  }
}
