import Client from "@kernel/Client";
import {GuildMember, Message, PermissionResolvable, PermissionString, TextChannel} from 'discord.js'
import {Command_Permissions} from "@interfaces/Command";

export default class Util {
    constructor(private client: Client) {
    }

    trimArray(arr: string[], maxLen = 10): string[] {
        let array;
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            array = arr.slice(0, maxLen);
            array.push(`${len} more...`);
        }
        return array;
    }

    formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
    }

    formatPerms(perm: PermissionString): PermissionString {
        return perm
            .toLowerCase()
            .replace(/(^|"|_)(\S)/g, (s: string) => s.toUpperCase())
            .replace(/_/g, ' ')
            .replace(/Guild/g, 'Server')
            .replace(/Use Vad/g, 'Use Voice Activity') as PermissionString;
    }

    removeDuplicates<T>(arr: []): T[] {
        return [...new Set(arr)];
    }

    abbreviateNumber(number: number, digits = 2): string {
        let expK = Math.floor(Math.log10(Math.abs(number)) / 3);
        let scaled = number / Math.pow(1000, expK);
        if (Math.abs(+scaled.toFixed(digits)) >= 1000) {
            scaled /= 1000;
            expK += 1;
        }
        const SI_SYMBOLS = 'apμm KМBTКQ';
        const BASE0_OFFSET = SI_SYMBOLS.indexOf(' ');
        if (expK + BASE0_OFFSET >= SI_SYMBOLS.length) {
            expK = SI_SYMBOLS.length - 1 - BASE0_OFFSET;
            scaled = number / Math.pow(1000, expK);
        } else if (expK + BASE0_OFFSET < 0) return '0';
        return (
            scaled.toFixed(digits).replace(/(\.|(\..*?))0+$/, '$2') +
            SI_SYMBOLS[expK + BASE0_OFFSET].trim()
        );
    }

    formatDate(date: Date, language?: string): string {
        const data = new Date(date);
        return data.toLocaleString(language || 'en', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
    }

    formatArray(array: PermissionString[], type?: string): PermissionString[] {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return new Intl.ListFormat('en-US', {
            style: 'short',
            type: type || "conjunction"
        }).format(array);
    }

    permission_check(member: GuildMember, permission: PermissionResolvable, message: Message): PermissionString[] {
        return this.formatArray((message.channel as TextChannel).permissionsFor(member)
            .missing(permission ? this.client.defaultPerms.add(permission) : this.client.defaultPerms).map(this.formatPerms))
    }

    managePerms(message: Message, command_permission: Command_Permissions): [PermissionString[], PermissionString[]] {
        const user_missing = this.permission_check(message.member, command_permission.user, message)
        const bot_missing = this.permission_check(message.guild.me, command_permission.bot, message)
        return [bot_missing, user_missing]
    }

    randomize(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min) + min);
    }

    toNum(text: string): number {
        return parseInt(text?.toString().replace(/[^\d]/g, ''));
    }
}