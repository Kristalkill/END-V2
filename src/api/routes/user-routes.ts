import { Router } from 'express'
import { sendError } from './api-routes'
import API from '../server'
import { User_Interface } from '@interfaces/MongoDB'

export default class User_Router {
    public router = Router();

  public constructor (API: API) {
      this.router.get('/', async (req, res) => {
        try {
          const user = await API.Client.getUser(req.query.key as string)
          res.json(user)
        } catch (error) {
          sendError(res, 400, error)
        }
      })

      this.router.get('/saved', async (req, res) => {
        try {
          const user = await API.Client.getUser(req.query.key as string)
          const savedUser = (await API.users()).find((x: User_Interface) => x.userID === user.id)
          res.json(savedUser)
        } catch (error) {
          sendError(res, 400, error)
        }
      })
    }
}
