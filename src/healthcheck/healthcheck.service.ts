import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  async getHealth() {
    return 'healthy';
  }
}
