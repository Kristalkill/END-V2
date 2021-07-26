import { DeleteWriteOpResultObject, FilterQuery, MongoClient, SortOptionObject, UpdateWriteOpResult } from 'mongodb'
import { Giveaway_Interface, Mute_Interface } from '@interfaces/MongoDB'

export default class MongoDB extends MongoClient {
    public _giveaways!: Map<string, Giveaway_Interface> | undefined;
    public _mutes!: Map<string, Mute_Interface> | undefined;
    public cool_downs: Map<string, number> = new Map();
    public boxes_cool_down: Set<string> = new Set();
    private readonly DB_NAME = 'END'

    public constructor (url: string = process.env.dataURL) {
      super(url, { useNewUrlParser: true, useUnifiedTopology: true })
    }

    public get giveaways () {
      return this._giveaways
    }
    public get mutes () {
      return this._mutes
    }

    public login (): Promise<void> {
      return new Promise( (resolve, reject) => {
        this.connect((err: Error) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    public async start (): Promise<void> {
      await this.login()
    }

    public getOne<T> (collection: string, filter: FilterQuery<T>, db: string = this.DB_NAME): Promise<T> {
      return this.db(db).collection(collection).findOne(filter)
    }

    public getMany<T> (collection: string, filter?: FilterQuery<T>, sort?: string | [string, number][] | SortOptionObject<T>, db: string = this.DB_NAME): Promise<Array<T>> {
      return this.db(db).collection(collection).find(filter).sort(sort || {}).toArray()
    }

    public insert_many<T extends { _id?: any }> (collection: string, data: Array<T>, db: string = this.DB_NAME): Promise<any> {
      return this.db(db).collection(collection).insertMany(data)
    }

    public insert_one<T> (collection: string, data: T, db: string = this.DB_NAME): Promise<any> {
      return this.db(db).collection(collection).insertOne(data)
    }

    public save<T extends { _id?: any }> (collection: string, data: T, db: string = this.DB_NAME): Promise<UpdateWriteOpResult> {
      return this.db(db).collection(collection).updateOne({ _id: data?._id }, { $set: data })
    }

    public update_many<T extends { _id?: any }> (collection: string, filter: FilterQuery<T>, data: T, db: string = this.DB_NAME): Promise<UpdateWriteOpResult> {
      return this.db(db).collection(collection).updateMany(filter, { $set: data })
    }

    public update_one<T extends { _id?: any }> (collection: string, filter: FilterQuery<T>, data: T, db: string = this.DB_NAME): Promise<UpdateWriteOpResult> {
      return this.db(db).collection(collection).updateOne(filter, { $set: data })
    }

    public delete<T> (collection: string, filter?: FilterQuery<T>, many = false, db: string = this.DB_NAME): Promise<DeleteWriteOpResultObject> {
      return many ? this.db(db).collection(collection).deleteMany(filter || {})
        : this.db(db).collection(collection).deleteOne(filter || {})
    }
    public async getOrInsert<T>(collection: string, filter: object, data: object, db: string = this.DB_NAME): Promise<T> {
        let doc = await this.getOne<T>(collection, filter, db)
        if(doc) return doc;
        else {
            let inserted = await this.insert_one(collection, data, db)
            return inserted.ops[0]
        }
    }
    public count<T> (collection: string, filter?: FilterQuery<T>, db: string = this.DB_NAME): Promise<number> {
      return this.db(db).collection(collection).countDocuments(filter)
    }
}
