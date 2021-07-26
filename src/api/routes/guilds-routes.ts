import { Router } from 'express'
import { sendError } from './api-routes'
import API from '../server'

export default class Guilds_Routes {
  public router: Router = Router();

  public constructor (API: API) {
      this.router.get('/', async (req, res) => {
        try {
          const user_guilds = await API.Client.getGuilds(req.query.key as string)
          const guilds = user_guilds.filter(g => {
            return (g.isOwner || g.permissions.some(x => ['ADMINISTRATOR', 'MANAGE_GUILD'].includes(x)))
          })
          for (const [id, guild] of guilds) {
            guild.db = (await API.db_guilds()).find(x => x.guildID === id)
            guild.hasbot = (await API.guilds()).has(guild.id)
          }
          res.send(Array.from(guilds.values()))
        } catch (error) {
          sendError(res, 400, error)
        }
      })

      this.router.get('/:id', async (req, res) => {
        try {
          const { id } = req.params
          const guilds = await API.Client.getGuilds(req.query.key as string)
          const guild = guilds.get(id)
          res.json(guild)
        } catch (error) {
          sendError(res, 400, error)
        }
      })
    }
}
