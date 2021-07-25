import {Snowflake} from "discord.js";

interface Guild_Moderation {
    auto: boolean
    mute_role: string,
}

interface Guild_Economy {
    shop: Record<Snowflake, number>
    upXP: number
    bonus: number
    money: number
    xp: number
}

interface Guild_Options {
    boxes: boolean
}

export interface Guild_Interface {
    _id?: any,
    guildID: string,
    ownerID: string,
    prefix: string,
    language: string,
    blocked_commands: string[]
    _premium: number,
    Moderation: Guild_Moderation
    Economy: Guild_Economy
    options: Guild_Options
}

export interface Block_Interface {
    _id?: any,
    id: string,
    reason: string,
}

interface User_Time {
    _premium: number
    _rep: number
    _bonus: number
}

export interface User_Economy {
    rep: number
    money: number
    level: number
    xp: number
    box: [number, number, number, number, number]
}

export interface User_Interface {
    _id?: any;
    userID: string,
    guildID: string,
    Economy: User_Economy
    messages: number
    warn: number
    time: User_Time
}

export interface Mute_Interface {
    userID: string,
    guildID: string,
    reason: string,
    time: number,
    channelID: string,
}

export interface Giveaway_Interface {
    guildID: string,
    time: number,
    prize: string,
    winners: number,
    messageID: string,
    channelID: string,
}