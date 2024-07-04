import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { USER_CONFIRMATION_QUEUE } from './user.constants';
import { UserService } from './user.service';

@Processor(USER_CONFIRMATION_QUEUE)
export class UserConfirmationConsumer {
  constructor(private readonly userService: UserService) {}

  @Process()
  async confirmUser(job: Job<{ id: string }>) {
    await this.userService.confirmUser(job.data.id);
  }
}
