import express from 'express'
import cors from 'cors'
import { Client } from './Client'
import bodyParser from 'body-parser'
import { resolve } from 'path'
import { config } from 'dotenv'
import Routes from './routes/api-routes'
import Rate from './modules/rate-limiter'
import { Manager } from '../Manager'
import { Command_Interface } from '@interfaces/Command'
import { Collection, Guild } from 'discord.js'
import MongoDB from '../bot/Constructions/Classes/MongoDB'
import { Guild_Interface, User_Interface } from '@interfaces/MongoDB'

config()

export default class API {
    public db: MongoDB = new MongoDB()
    public manager: Manager;
    public Client = new Client({
      id: process.env.CLIENT_ID || '',
      secret: process.env.CLIENT_SECRET || '',
      redirectURI: `${process.env.DASHBOARD_URL}/auth`,
      scopes: ['identify', 'guilds']
    })

    public app = express()

    public constructor (manager: Manager) {
      this.manager = manager
      this.db.start().then(() => this.start())
    }

    public async commands (): Promise<Collection<string, Command_Interface>> {
      return await this.manager.shards.first()?.eval(`this.commands.map(x => x.basic).filter(x => x.category !== 'development')`)
    }

    public async users (): Promise<Array<User_Interface>> {
      return await this.db.getMany<User_Interface>('users')
    }

    public  async db_guilds (): Promise<Array<Guild_Interface>> {
      return await this.db.getMany<Guild_Interface>('guilds')
    }

    public async guilds (): Promise<Collection<string, Guild>> {
      return new Collection((await this.manager.broadcastEval('Array.from(this.guilds.cache)')).flat())
    }

    public async stats (): Promise<number[]> {
      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue
      return [
        (await this.manager.broadcastEval('(process.cpuUsage().user/1024/1024/100)')).reduce(reducer),
        (await this.manager.broadcastEval('process.memoryUsage().heapUsed')).reduce(reducer),
        (await this.manager.fetchClientValues('channels.cache.size')).reduce(reducer),
        (await this.manager.fetchClientValues('guilds.cache.size')).reduce(reducer),
        (await this.manager.fetchClientValues('emojis.cache.size')).reduce(reducer),
        (await this.manager.fetchClientValues('users.cache.size')).reduce(reducer),
        (await this.manager.fetchClientValues('ws.ping')).reduce(reducer) / this.manager.shards.size
      ].flat()
    }
    private async start (): Promise<void> {
        const PORT = process.env.PORT || 3001
        this.app.listen((PORT), () => console.log(`API is live on port ${PORT}`))
        this.app.use(cors())
            .use(bodyParser.json())
            .use(new Rate(this.db).Limiter)
        const dashboardPath = resolve('../dist')
        this.app
            .use('/api', new Routes(this).router)
            .use(express.static(dashboardPath))
            .all('*', (_req, res) => res.status(200))
    }
}
