import { Test, TestingModule } from '@nestjs/testing';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';
import { PasswordRepository } from '../repositories/password.repository';

describe('PasswordController', () => {
  let controller: PasswordController;
  let service : PasswordService;
  let passwordRepository: PasswordRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordController],
      providers: [PasswordService,PasswordRepository]
    }).compile();

    controller = module.get<PasswordController>(PasswordController);
    service = module.get<PasswordService>(PasswordService);
    passwordRepository = module.get<PasswordRepository>(PasswordRepository);
  });

  it('should be defined to change user password', async () => {
    let changePassword = {newPassword : 'Password123!!', confirmPassword: 'Password123!!'}
    let mockReq = {user : { id : '463a7f16-14da-4bb4-beea-566be05ff369'}}
    jest.spyOn(service, 'changeUserPassword').mockImplementation(() => Promise.resolve(true))
    let response = true;
    expect(await controller.changePassword(changePassword,mockReq)).toBe(response);
});
});
