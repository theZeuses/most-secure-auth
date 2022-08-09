import { UserService } from "@modules/users/user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from '@modules/users/entities';
import { userStub } from '../stubs/user.stub';
import { Repository } from 'typeorm';
import { CreateUserInput } from "@modules/users/dto";
import * as argon from "argon2";

const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

describe("UserService", () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_REPOSITORY_TOKEN,
                    useValue: {
                        create: jest.fn().mockReturnValue(userStub()),
                        findOneBy: jest.fn().mockResolvedValue(userStub()),
                        save: jest.fn().mockResolvedValue(userStub())
                    }
                }
            ],
          }).compile();
      
          userService = module.get<UserService>(UserService);
          userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
      
          jest.clearAllMocks();
    });

    describe('root', () => {
        it('should be defined', () => {
            expect(userService).toBeDefined();
        });
        it('should instantiate repository', () => {
            expect(userRepository).toBeDefined();
        });
    });
    describe('when create() is called', () => {
        let user: UserEntity;
        let createUserInput; CreateUserInput;
    
        beforeEach(async () => {
          createUserInput = {
            username: userStub().username,
            password: userStub().password
          }
          jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
        });
        
        it('should call userRepository.findOneBy()', async () => {
            user = await userService.create(createUserInput);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({username: createUserInput.username});
        });

        it('should call argon.hash()', async () => {
            jest.spyOn(argon, 'hash').mockResolvedValue('hashed');
            user = await userService.create(createUserInput);
            expect(argon.hash).toHaveBeenCalledWith(createUserInput.password);
        });

        it('should hash user password', async () => {
            jest.spyOn(argon, 'hash').mockResolvedValue('hashed');
            user = await userService.create(createUserInput);
            expect(userRepository.save).toHaveBeenCalledWith({
                ...userStub(),
                password: 'hashed'
            });
        });
    });
    describe('when findOneByUsername is called', () => {
        let user: UserEntity;

        beforeEach(async () => {
            user = await userService.findOneByUsername(userStub().username);
        });

        it('should call userRepository.findOneBy', () => {
            expect(userRepository.findOneBy).toBeCalledWith({
                username: userStub().username
            })
        });

        it('should call return a user', () => {
            expect(user).toEqual(userStub());
        });
    });

    describe('when findOneById is called', () => {
        let user: UserEntity;

        beforeEach(async () => {
            user = await userService.findOneById(userStub().id);
        });

        it('should call userRepository.findOneBy', () => {
            expect(userRepository.findOneBy).toBeCalledWith({
                id: userStub().id
            })
        });

        it('should call return a user', () => {
            expect(user).toEqual(userStub());
        });
    });
});