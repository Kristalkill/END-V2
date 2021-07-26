import { Shard } from 'discord.js'

export default class Logger {
    public shard: Shard | undefined

    public get id (): number | '?' {
      return this.shard?.id ? this.shard.id : '?'
    }

    public debug (title: string, message: string): void {
      console.log(
            `[Process ${process.pid}] [Cluster ${this.id}] [${title}] ${message}`
      )
    }

    public log (title: string, message: string): void {
      console.log(
            `[Process ${process.pid}] [Cluster ${this.id}] [${title}] ${message}`
      )
    }

    public error (error: string | Error): void {
      console.error(`[Process ${process.pid}] [Cluster ${this.id}] `, error)
    }
}
