import { BitField, Client, Collection, Intents, Permissions, PermissionString } from 'discord.js'
import { Config } from '@interfaces/Config'
import Loader from './Loader'
import Util from '../Util/Util'
import Logger from '@classes/Logger'
import Embed from '@classes/Embed'
import MongoDB from '@classes/MongoDB'
import Command from '@classes/Command'
import Event from '@classes/Event'
import Systems from '../Systems/Systems'

export default class extends Client {
    public defaultPerms: Readonly<BitField<PermissionString>> = new Permissions().freeze();
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public owners: string[] = ['359678229096955904'];
    public embed: Embed = new Embed()
    public db: MongoDB = new MongoDB(process.env.dataURL);
    public logger: Logger = new Logger();
    public utils: Util
    public loader: Loader
    systems: Systems;

    public constructor () {
      super({
        disableMentions: 'everyone',
        messageCacheMaxSize: 200,
        ws: {
          intents: Intents.ALL
        },
        messageCacheLifetime: 200,
        messageEditHistoryMaxSize: 200,
        messageSweepInterval: 200,
        restTimeOffset: 0
      })
      this.utils = new Util(this)
      this.loader = new Loader(this)
      this.systems = new Systems(this)
    }

    public async start (config: Config): Promise<void> {
      await this.loader.load()
      await this.db.connect()
      await super.login(config.token)
    }
}
