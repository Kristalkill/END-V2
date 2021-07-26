import { RateLimiterMongo } from 'rate-limiter-flexible'
import MongoDB from '../../bot/Constructions/Classes/MongoDB'

export default class Rate extends RateLimiterMongo {
    public Limiter: (req: any, res: any, next: any) => void;

    public constructor (db: MongoDB) {
      super({
        storeClient: db,
        dbName: 'END',
        points: 10, // Number of points
        duration: 1 // Per second(s)
      })
      this.Limiter = (req: any, res: any, next: any) => {
        this.consume(req.ip)
          .then(() => {
            next()
          })
          .catch((err) => {
            console.log(err)
            res.status(429).json('TooManyRequestShort')
          })
      }
    }
}
