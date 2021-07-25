import Client from '../../kernel/Client'
import { ClientEvents } from 'discord.js'

export interface Event_Interface {
    client: Client
    type: string;
    name: keyof ClientEvents
    run: Event_Run
    emitter: Client | keyof Client
}

export interface Event_Run {
    (...args: any[]): Promise<void>
}
