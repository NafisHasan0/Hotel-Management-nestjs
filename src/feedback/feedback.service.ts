import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dtos/createFeedback.dto';
import { DeleteFeedbackDto } from './dtos/deleteFeedback.dto';
import { UpdateFeedbackDto } from './dtos/updateFeedback.dto';
    
@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<{ message: string }> {
    const feedback = this.feedbackRepository.create(dto);
    await this.feedbackRepository.save(feedback);
    return { message: 'Feedback created successfully' };
  }

  async findOne(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({ where: { feedback_id: id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    return feedback;
  }

  async update(id: number, dto: UpdateFeedbackDto): Promise<{ message: string }> {
    const feedback = await this.feedbackRepository.findOne({ where: { feedback_id: id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    Object.assign(feedback, dto);
    await this.feedbackRepository.save(feedback);
    return { message: 'Feedback updated successfully' };
  }

  async delete(id: number, dto: DeleteFeedbackDto): Promise<{ message: string }> {
    const feedback = await this.feedbackRepository.findOne({ where: { feedback_id: id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }
    await this.feedbackRepository.remove(feedback);
    return { message: 'Feedback deleted successfully' };
  }
}