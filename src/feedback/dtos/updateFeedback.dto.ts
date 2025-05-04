import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateFeedbackDto {
  @IsString()
  @IsOptional()
  feedback?: string;

  @IsInt()
  @IsOptional()
  user_id?: number;
}