import { userStub } from '../test/stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
    create: jest.fn().mockResolvedValue(userStub())
});