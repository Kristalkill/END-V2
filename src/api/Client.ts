import jwt, { JwtPayload } from 'jsonwebtoken'
import phin from 'phin'
import uid from 'uid'
import User from './types/user'
import APIError from './types/APIError'
import Guild from './types/guild'
import Connection from './types/connection'
import Collection from '@discordjs/collection'

export type Scope =
    'bot'
    | 'connections'
    | 'email'
    | 'identify'
    | 'guilds'
    | 'guilds.join'
    | 'gdm.join'
    | 'messages.read'
    | 'rpc'
    | 'rpc.api'
    | 'rpc.notifications.read'
    | 'webhook.incoming';

interface CodeLink {
    url: string,
    state: string
}

export class Client {
    private baseURL = 'https://discord.com/api/';

    /** Create a new OAuth2 Client. */
    public constructor (private options: ClientOptions) {}

    /** Generates a authorization code link depending on the scopes and redirect URI set. */
    public get authCodeLink (): CodeLink {
      if (this.options.scopes.length > 0) {
        const state = uid(16)
        return {
          url: `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${this.options.id}&scope=${this.options.scopes.join('%20')}&state=${state}&redirect_uri=${this.options.redirectURI}&prompt=none`,
          state
        }
      } else throw new TypeError('Scopes are not defined.')
    }

    /** Gets the access token for the user to perform further functions. */
    public async getAccess (code: string): Promise<string> {
      if (!code) { throw new TypeError('Authorization code not provided.') }

      const response: any = await phin({
        method: 'POST',
        url: `${this.baseURL}oauth2/token`,
        parse: 'json',
        form: {
          client_id: this.options.id,
          client_secret: this.options.secret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.options.redirectURI,
          scope: this.options.scopes.join(' ')
        }
      })
      if (response.statusCode === 200) {
        const token = response.body
        token.expireTimestamp = Date.now() + token.expires_in * 1000 - 10000
        return jwt.sign(token, this.options.secret, { expiresIn: token.expires_in })
      } else { throw new APIError(response.statusCode) }
    }

    /** Gets a new access token for the user whose access token has expired. */
    public async refreshToken (key: string): Promise<string> {
      const access = this.getAccessKey(key)

      try {
        const response: any = await phin({
          url: `${this.baseURL}oauth2/token`,
          method: 'POST',
          parse: 'json',
          form: {
            client_id: this.options.id,
            client_secret: this.options.secret,
            grant_type: 'refresh_token',
            refresh_token: access.refresh_token,
            redirect_uri: this.options.redirectURI,
            scope: this.options.scopes.join(' ')
          }
        })
        if (response.statusCode !== 200) throw new APIError(response.statusCode)

        const token = response.body
        token.expireTimestamp = Date.now() + token.expires_in * 1000 - 10000

        return jwt.sign(token, this.options.secret, { expiresIn: token.expires_in })
      } catch (err) {
        throw (err.error
          ? new TypeError(err.error)
          : new APIError(err.phinResponse?.statusCode))
      }
    }

    /** Gets the user who has authorized using the OAuth2 flow. */
    public async getUser (key: string): Promise<User> {
      const access = this.getAccessKey(key)

      try {
        const response: any = await phin({
          url: `${this.baseURL}users/@me`,
          method: 'GET',
          headers: { Authorization: `${access.token_type} ${access.access_token}` },
          parse: 'json'
        })
        if (response.statusCode !== 200) { throw new APIError(response.statusCode) }

        return new User(response.body)
      } catch (err) {
        throw (err.error
          ? new TypeError(err.error)
          : new APIError(err.phinResponse?.statusCode))
      }
    }

    /** Gets the guilds of an authorized user. */
    public async getGuilds (key: string): Promise<Collection<string, Guild>> {
      const access = this.getAccessKey(key)
      const response: any = await phin({
        url: `${this.baseURL}users/@me/guilds`,
        method: 'GET',
        headers: { Authorization: `${access.token_type} ${access.access_token}` },
        parse: 'json'
      })
      if (response.statusCode !== 200) { throw new APIError(response.statusCode) }

      const guilds = new Collection<string, Guild>()
      for (const guild of response.body) { guilds.set(guild.id, new Guild(guild)) }

      return guilds
    }

    /** Gets the connected third-party accounts of an authorized user. */
    public async getConnections (key: string): Promise<Collection<string, Connection>> {
      const access = this.getAccessKey(key)

      try {
        const response: any = await phin({
          url: `${this.baseURL}users/@me/connections`,
          method: 'GET',
          headers: { Authorization: `${access.token_type} ${access.access_token}` },
          parse: 'json'
        })
        if (response.statusCode !== 200) { throw new APIError(response.statusCode) }

        const connections = new Collection<string, Connection>()
        for (const connection of response.body) { connections.set(connection.id, connection) }

        return connections
      } catch (err) {
        throw (err.error
          ? new TypeError(err.error)
          : new APIError(err.phinResponse?.statusCode))
      }
    }

    private getAccessKey (key: string): JwtPayload {
      return jwt.verify(key, this.options.secret) as JwtPayload
    }
}

/** Required options for the client - https://discord.com/developers. */
export interface ClientOptions {
    /** Discord client ID. */
    id: string;
    /** Discord application secret. */
    secret: string;
    /** OAuth Redirect URI that is sent an access code. */
    redirectURI: string;
    /** Scopes for client access. */
    scopes: Scope[];
}
