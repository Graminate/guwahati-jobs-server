import { Injectable } from '@nestjs/common';

import pool from '@/config/database';
import { CreateCompanyProfileDto, UpdateCompanyProfileDto } from './company-profiles.dto';

@Injectable()
export class CompanyProfilesService {
  private companyFields =
    'user_id, company_name, description, logo_url, industry, website, location, social_links';

  async create({
    user_id,
    company_name,
    description,
    logo_url,
    industry,
    website,
    location,
    social_links,
  }: CreateCompanyProfileDto) {
    return (
      await pool.query(
        `INSERT INTO company_profiles(${this.companyFields})
       VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          user_id,
          company_name,
          description,
          logo_url,
          industry,
          website,
          location,
          social_links ? JSON.stringify(social_links) : null,
        ],
      )
    ).rows[0];
  }

  async findAll() {
    return (await pool.query('SELECT * FROM company_profiles')).rows;
  }

  async findOne(id: number) {
    return (
      await pool.query('SELECT * FROM company_profiles WHERE id = $1', [id])
    ).rows[0];
  }

  async update(
    id: number,
    {
      company_name,
      description,
      logo_url,
      industry,
      website,
      location,
      social_links,
    }: UpdateCompanyProfileDto,
  ) {
    return (
      await pool.query(
        `UPDATE company_profiles SET
        company_name = COALESCE($1, company_name),
        description = COALESCE($2, description),
        logo_url = COALESCE($3, logo_url),
        industry = COALESCE($4, industry),
        website = COALESCE($5, website),
        location = COALESCE($6, location),
        social_links = COALESCE($7, social_links),
        updated_at = NOW()
       WHERE id = $8 RETURNING *`,
        [
          company_name,
          description,
          logo_url,
          industry,
          website,
          location,
          social_links ? JSON.stringify(social_links) : null,
          id,
        ],
      )
    ).rows[0];
  }

  async remove(id: number) {
    return (
      await pool.query(
        'DELETE FROM company_profiles WHERE id = $1 RETURNING *',
        [id],
      )
    ).rows[0];
  }
}
