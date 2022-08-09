import { UserEntity } from "@modules/users/entities"

export const userStub = () : UserEntity => {
    return {
        id: 1,
        username: "guest",
        password:  "guest"
    }
}