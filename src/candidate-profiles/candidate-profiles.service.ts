import { Injectable } from '@nestjs/common';

import pool from '@/config/database';
import {
  CreateCandidateProfileDto,
  UpdateCandidateProfileDto,
} from './candidate-profiles.dto';

@Injectable()
export class CandidateProfilesService {
  private profileFields =
    'user_id, resume_text, skills, education, experience, portfolio_url';

  async create({
    user_id,
    resume_text,
    skills,
    education,
    experience,
    portfolio_url,
  }: CreateCandidateProfileDto) {
    return (
      await pool.query(
        `INSERT INTO candidate_profiles(${this.profileFields})
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user_id, resume_text, skills, education, experience, portfolio_url],
      )
    ).rows[0];
  }

  async findAll() {
    return (await pool.query('SELECT * FROM candidate_profiles')).rows;
  }

  async findOne(id: number) {
    return (
      await pool.query('SELECT * FROM candidate_profiles WHERE id = $1', [id])
    ).rows[0];
  }

  async update(
    id: number,
    {
      resume_text,
      skills,
      education,
      experience,
      portfolio_url,
    }: UpdateCandidateProfileDto,
  ) {
    return (
      await pool.query(
        `UPDATE candidate_profiles SET
        resume_text = COALESCE($1, resume_text),
        skills = COALESCE($2, skills),
        education = COALESCE($3, education),
        experience = COALESCE($4, experience),
        portfolio_url = COALESCE($5, portfolio_url),
        updated_at = NOW()
       WHERE id = $6 RETURNING *`,
        [resume_text, skills, education, experience, portfolio_url, id],
      )
    ).rows[0];
  }

  async remove(id: number) {
    return (
      await pool.query(
        'DELETE FROM candidate_profiles WHERE id = $1 RETURNING *',
        [id],
      )
    ).rows[0];
  }
}
