import { Shard } from 'discord.js'

export default class Logger {
    public shard: Shard

    get id (): number | '?' {
      return this.shard && this.shard.id ? this.shard.id : '?'
    }

    debug (title: string, message: string): void {
      console.log(
            `[Process ${process.pid}] [Cluster ${this.id}] [${title}] ${message}`
      )
    }

    log (title: string, message: string): void {
      console.log(
            `[Process ${process.pid}] [Cluster ${this.id}] [${title}] ${message}`
      )
    }

    error (error: string | Error): void {
      console.error(`[Process ${process.pid}] [Cluster ${this.id}] `, error)
    }
}
