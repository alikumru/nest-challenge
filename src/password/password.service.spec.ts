import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { PasswordRepository } from '../repositories/password.repository';

describe('PasswordService', () => {
  let service: PasswordService;
  let repository: PasswordRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordService],
      providers: [ PasswordRepository],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
    repository = module.get<PasswordRepository>(PasswordRepository);
  });

  it('should be defined', async () => {

  });
});
