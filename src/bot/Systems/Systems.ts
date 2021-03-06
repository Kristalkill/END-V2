import Client from '@kernel/Client'
import Message from './Other/Message'

export default class Systems {
    public message: Message = new Message(this.client)

    public constructor (protected readonly client: Client) {}
}
