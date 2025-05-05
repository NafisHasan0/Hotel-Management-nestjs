import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSalaryHistoryDto {
  @IsNotEmpty()
  @IsString()
  action_type: string;

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsNotEmpty()
  @IsNumber()
  employee_id: number;

  @IsNotEmpty()
  @IsNumber()
  recorded_by_employee_id: number;

  @IsOptional()
  @IsNumber()
  salary_id?: number;

  @IsOptional()
  @IsNumber()
  totalSalary?: number;
}
