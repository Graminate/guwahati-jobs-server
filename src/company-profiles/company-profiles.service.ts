import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateCompanyProfileDto } from './dto/create-company-profile.dto';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

@Injectable()
export class CompanyProfilesService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async create(createCompanyProfileDto: CreateCompanyProfileDto) {
    const {
      user_id,
      company_name,
      description,
      logo_url,
      industry,
      website,
      location,
      social_links,
    } = createCompanyProfileDto;
    const query = `
      INSERT INTO company_profiles(user_id, company_name, description, logo_url, industry, website, location, social_links)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `;
    const values = [
      user_id,
      company_name,
      description,
      logo_url,
      industry,
      website,
      location,
      social_links ? JSON.stringify(social_links) : null,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query('SELECT * FROM company_profiles');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await this.pool.query(
      'SELECT * FROM company_profiles WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  async update(id: number, updateCompanyProfileDto: UpdateCompanyProfileDto) {
    const {
      company_name,
      description,
      logo_url,
      industry,
      website,
      location,
      social_links,
    } = updateCompanyProfileDto;
    const query = `
      UPDATE company_profiles 
      SET company_name = COALESCE($1, company_name),
          description = COALESCE($2, description),
          logo_url = COALESCE($3, logo_url),
          industry = COALESCE($4, industry),
          website = COALESCE($5, website),
          location = COALESCE($6, location),
          social_links = COALESCE($7, social_links),
          updated_at = NOW()
      WHERE id = $8 RETURNING *
    `;
    const values = [
      company_name,
      description,
      logo_url,
      industry,
      website,
      location,
      social_links ? JSON.stringify(social_links) : null,
      id,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await this.pool.query(
      'DELETE FROM company_profiles WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}
