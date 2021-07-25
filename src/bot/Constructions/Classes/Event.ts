import {Event_Interface, Event_Run} from "@interfaces/Event";
import {ClientEvents} from "discord.js";
import Client from "../../kernel/Client";
import Language from "../../languages/Language";

export default class Event implements Event_Interface {
    public emitter: Client | keyof Client
    public name: keyof ClientEvents;
    public run: Event_Run;
    public client: Client;
    public type: 'once' | 'on'

    public constructor(client: Client, once: boolean | null, emitter?: string | null) {
        this.client = client;
        this.type = once ? 'once' : 'on';
        this.emitter = (emitter ? (this.client as any)[emitter] : emitter) || this.client
    }

    async language(preferredLocale: string): Promise<Language> {
        return await import(`../languages/${preferredLocale.slice(0, 2) || 'en'}`);
    }

}