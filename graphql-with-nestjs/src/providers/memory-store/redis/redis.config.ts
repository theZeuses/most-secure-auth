import { redisOptions } from '@src/config'


export const redisForMSConfig = {
    ...redisOptions,
    db: 1
}