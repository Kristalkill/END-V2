import {Router} from 'express';
import {appendFile} from 'fs';
import User_Router from './user-routes';
import {promisify} from 'util';
import {resolve} from 'path';
import Guilds_Routes from "./guilds-routes";
import API from "../server";

const appendedFile = promisify(appendFile);
const dashboardLogsPath = resolve('./logs/dashboard');
const sessionDate = new Date()
    .toISOString()
    .replace(/:/g, '');
export default class Routes {
    public router = Router();

    public constructor(API: API) {
        this.router.get('/', (req, res) => res.json({hello: ''}));
        this.router.get('/commands', async (req, res) => res.send(await API.commands()));
        this.router.get('/stats', async (req, res) => res.send(await API.stats()))
        this.router.get('/auth', async (req, res) => {
            try {
                const key = await API.Client.getAccess(req.query.code.toString());
                res.json(key);
            } catch (error) {
                sendError(res, 400, error);
            }
        });

        this.router.post('/error', async (req, res) => {
            try {
                const {message} = req.body;

                await appendedFile(`${dashboardLogsPath}/${sessionDate}.log`, message + '\n');

                res.json({code: 200, message: 'Success!'});
            } catch (error) {
                sendError(res, 400, error);
            }
        });
        this.router.use('/guilds', new Guilds_Routes(API).router)
            .get('/login', (req, res) => res.redirect(API.Client.authCodeLink.url))
            .use('/user', new User_Router(API).router)
            .get('*', (req, res) => res.status(404).json({code: 404}));

    }
}

export function sendError(res: any, code: number, error: Error) {
    return res.status(code).json({code, message: error?.message})
}
