import { UserResolver } from '@modules/users/user.resolver';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '@modules/users/user.service';
import { UserEntity } from '@modules/users/entities';
import { CreateUserInput } from '@modules/users/dto';
import { userStub } from '../stubs/user.stub';

jest.mock("../../user.service");

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService],
    }).compile();

    userResolver = module.get<UserResolver>(UserResolver);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('when sayHello() is called', () => {
    it('should return "Hello"', () => {
      expect(userResolver.sayHello()).toBe('Hello');
    });
  });

  describe('when createUser() is called', () => {
    let user: UserEntity;
    let createUserInput; CreateUserInput;

    beforeEach(async () => {
      createUserInput = {
        username: userStub().username,
        password: userStub().password
      }

      user = await userResolver.createUser(createUserInput);
    });

    it('should call userService', () => {
      expect(userService.create).toHaveBeenCalledWith(createUserInput);
    });

    it('should return a user', () => {
      expect(user).toEqual(userStub());
    });
  });
});
