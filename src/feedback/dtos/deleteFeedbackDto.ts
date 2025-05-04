import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteFeedbackDto {
  @IsInt()
  @IsNotEmpty()
  feedback_id: number;
}