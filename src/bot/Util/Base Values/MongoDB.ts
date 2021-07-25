import {Guild_Interface, User_Interface} from "@interfaces/MongoDB";

export function User_basic(id: string, guild_id: string): User_Interface {
    return {
        userID: id,
        guildID: guild_id,
        Economy: {
            box: [0, 0, 0, 0, 0],
            rep: 0,
            money: 0,
            level: 0,
            xp: 0,
        },
        messages: 0,
        warn: 0,
        time: {
            _premium: 0,
            _rep: 0,
            _bonus: 0
        }

    }
}

export function Guild_basic(id: string, owner_id: string, preferredLocale: string): Guild_Interface {
    return {
        guildID: id,
        ownerID: owner_id,
        _premium: 0,
        prefix: 'k!',
        blocked_commands: [],
        language: preferredLocale.slice(0, 2),
        Moderation: {
            auto: false,
            mute_role: '',
        },
        Economy: {
            shop: Object(),
            upXP: 100,
            bonus: 50,
            money: 3,
            xp: 5
        },
        options: {
            boxes: false
        }
    }
}