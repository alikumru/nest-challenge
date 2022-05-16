import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '../repositories/user.repository';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService,UserRepository]
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined to find user by user id', async () => {
      let result = {id : '463a7f16-14da-4bb4-beea-566be05ff369', email: 'user1@foreside.nl', name: 'Test User 1'}
      jest.spyOn(userService, 'findUserById').mockImplementation(() => Promise.resolve(result))
      let user = {id : '463a7f16-14da-4bb4-beea-566be05ff369'};
      expect(await controller.findUserById(user)).toBe(result);
  });
});
