import { IsOptional, IsNumber } from 'class-validator';

export class UpdateSalaryDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
}
