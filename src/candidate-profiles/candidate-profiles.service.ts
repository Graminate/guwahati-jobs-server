import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCandidateProfileDto } from './dto/create-candidate-profile.dto';
import { UpdateCandidateProfileDto } from './dto/update-candidate-profile.dto';

@Injectable()
export class CandidateProfilesService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createCandidateProfileDto: CreateCandidateProfileDto) {
    const {
      user_id,
      resume_text,
      skills,
      education,
      experience,
      portfolio_url,
    } = createCandidateProfileDto;
    const query = `
      INSERT INTO candidate_profiles(user_id, resume_text, skills, education, experience, portfolio_url)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *
    `;
    const values = [
      user_id,
      resume_text,
      skills,
      education,
      experience,
      portfolio_url,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM candidate_profiles');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM candidate_profiles WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  async update(
    id: number,
    updateCandidateProfileDto: UpdateCandidateProfileDto,
  ) {
    const { resume_text, skills, education, experience, portfolio_url } =
      updateCandidateProfileDto;
    const query = `
      UPDATE candidate_profiles 
      SET resume_text = COALESCE($1, resume_text),
          skills = COALESCE($2, skills),
          education = COALESCE($3, education),
          experience = COALESCE($4, experience),
          portfolio_url = COALESCE($5, portfolio_url),
          updated_at = NOW()
      WHERE id = $6 RETURNING *
    `;
    const values = [
      resume_text,
      skills,
      education,
      experience,
      portfolio_url,
      id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM candidate_profiles WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
