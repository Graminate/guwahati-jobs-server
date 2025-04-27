import { Controller, Post, Body, Res } from '@nestjs/common';
import { PasswordService } from './password.service';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { ForgotPasswordDto, ResetPasswordDto } from './password.dto';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post('forgot')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    const result = await this.passwordService.handleForgot(body.email);
    return res.status(result.status).json(result.data);
  }

  @Post('reset')
  async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    const result = await this.passwordService.handleReset(body);
    return res.status(result.status).json(result.data);
  }
}
