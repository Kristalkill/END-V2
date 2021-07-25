import { Shard, ShardingManager } from 'discord.js'
import { config } from 'dotenv'
import API from './api/server'

config()

export class Manager extends ShardingManager {
    private api: API;

    constructor () {
      super(__dirname + '/bot/index.js', {
        totalShards: 1,
        token: process.env.TOKEN,
        mode: 'process'
      })
      this.on('shardCreate', (shard: Shard) => {
        console.log(`[SHARDS] Shard ${shard.id} is created`)
        shard.on('ready', () => {
          console.log(`[SHARDS] Shard ${shard.id} is ready`)
        })
        shard.on('disconnect', () => {
          console.log(`[SHARDS] Shard ${shard.id} was disconnected`)
        })
        shard.on('reconnecting', () => {
          console.log(`[SHARDS] Shard ${shard.id} is reconnecting`)
        })
        shard.on('death', () => {
          console.log(`[SHARDS] Shard ${shard.id} is dead`)
        })
      })
    }

    start (): void {
      this.spawn(this.totalShards).then(() => {
        this.api = new API(this)
      })
    }
}

new Manager().start()
