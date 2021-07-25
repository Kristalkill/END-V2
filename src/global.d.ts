import {Guild_Interface, User_Interface} from '@interfaces/MongoDB'

declare global {
    namespace Intl {
        class ListFormat {
            public format: (items: string[]) => string;
        }
    }
    namespace NodeJS {
        interface ProcessEnv {
            token: string
            TOTAL_SHARDS: string
            dataURL: string
            PORT: string
            defaultPerms: string
        }
    }

    interface String {
        capitalize(): string;

        clear(): string;

        translate<T>(vars: T): string;

        chunk(this: string, len: number): string[];
    }

    interface Boolean {
        parse(val: string): boolean
    }

    interface Array<T> {
        shuffled(): T[]
    }
}
declare module 'discord.js' {
    export interface Guild {
        settings: Guild_Interface
    }

    export interface GuildMember {
        options: User_Interface
    }
}
export {}
