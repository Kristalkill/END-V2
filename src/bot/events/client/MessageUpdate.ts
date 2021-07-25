import { Event_Run } from '@interfaces/Event'
import Event from '@classes/Event'
import { ClientEvents } from 'discord.js'

export default class message extends Event {
    public name: keyof ClientEvents = 'messageUpdate';

    public run: Event_Run = async (message_old, message) => {
      await this.client.systems.message.reaction_on_message(message)
    };
}
