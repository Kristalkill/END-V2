export const commands = {
    block: {
        command: {
            usage: "block <user/ID> [Reason]",
            description: "Gives a bonus every 24 hours"
        },
        parameters: {
            Unknown: "Unknown",
            already_blocked: "%member% has already been blocked for %reason%",
            successful_text: "%member% was successfully blocked for **%reason% **"
        }
    },
    add: {
        command: {
            usage: "add <User / ID> <Money / Xp / Level / Rep> <amount>",
            description: "Add Money / Xp / Level / Rep to user"
        },
        parameters: {
            successful_text: "You have successfully delivered %type% to the user: **%name% ** in the amount of %amount%",
            specify_type: "Indicate what you want to deliver!",
            specify_amount: "Specify the amount you want to bet at least 1 and no more than 10M"
        }
    },
    bonus: {
        command: {
            usage: "bonus",
            description: "Gives a bonus every 24 hours"
        },
        parameters: {
            already_take: "You have already taken your bonus today. Come in %time%",
            successful_text: "You have taken away your today's bonus `%bonus%` $"
        }
    },
    lb: {
        command: {
            usage: "lb <Money/Xp/Level/Rep>",
            description: "Show leader-board for a specific parameter"
        },
        parameters: {
            specify_type: "Enter what you want to watch!",
            empty: "Unfortunately the table for this server is empty.",
            Unknown: "Unknown"
        }
    },
    pay: {
        command: {
            usage: "pay <User / ID> <amount>",
            description: "The team will allow you to transfer money to another user"
        },
        parameters: {
            no_member: "That user can't be found.",
            indicate_number: "Indicate the number of coins you want to give away.",
            many_coins: "You cannot transfer so many coins.",
            enter_valid_value: "Please enter a valid value.",
            no_data: "Unfortunately **%member%** is not present in the database.",
            no_have_coins: "You don't have that many coins.",
            no_yourself: "You cannot transfer money to yourself!",
            no_bots: "Bots are not humans.",
            successfully_text: "**%author% ** successfully transferred **%member% ** coins of %args1%"
        }
    },
    profile: {
        command: {
            usage: "profile [User / ID]",
            description: "View Profile"
        },
        parameters: {
            devices: {
                pc: "Computer",
                web: "Website",
                mobile: "Smartphone"
            },
            types: {
                play: "**Play in**",
                stream: "**Streaming**",
                listen: "**Listens**",
                looks: "**Looks**",
                null: "None"
            },
            reputation: {
                satan: "Satan",
                devil: "Devil",
                hypocrite: "Hypocrites",
                neutral: "Neutral",
                kind: "Kind person",
                servant: "Servant of the People",
                angel: "Angel"
            },
            embed: {
                about: ">>> **About user**",
                about_text: ">>> ** Status **:%activity%\n** Icons: **%ftext%\n** Device: **%statuses% %devicesText%\n** Account created **: %createdAt%\n** Joined **:%joinedAt%",
                account: ">>> **Account**",
                account_text: ">>> ** 💰│Balance **:%money%\n** 🔰│Level **: %level% ** XP: ** (%xp%) ** Remaining: **%leftxp% XP\n** 🚩│Warns**: %warn%\n**:thumbsup_tone3:│Reputation: **%reputation% ",
                achievements: "Achievements",
                roles: "Roles",
                no_have: "**Doesn't have any**"
            }
        }
    },
    rep: {
        command: {
            usage: "rep [+/-] <User / ID>",
            description: "Add / subtract reputation"
        },
        parameters: {
            not_yourself: "** You can't do it yourself :) **",
            time_no_come: "The time has not come, it remains **%time%**",
            up: "** Reputation has been downgraded! **",
            down: "** Reputation has been increased! **",
            have: "%name% has %rep% reputations"
        }
    },
    rps: {
        command: {
            usage: "rps <Bet>",
            description: "Rock, Paper, Scissors"
        },
        parameters: {
            min_bet: "Minimal bet `1$`",
            no_have_money: "You don't have enough money!",
            emoji: "Click on emoji!",
            win: "You won!",
            win_text: "Emoji: %emojis%\nYou won **%win% $ **",
            draw: "Draw",
            draw_text: "Emoji: %emojis%",
            lose: "You lose",
            lose_text: "Emoji: %emojis%\nYou lose **%lose% $ **"
        }
    },
    set: {
        command: {
            usage: "set <User / ID> <Money / Xp / Level / Rep> <quantity>",
            description: "Set Money / Xp / Level / Rep to user"
        },
        parameters: {
            successfully_text: "You have successfully delivered %arg1% to the user: **%name%** in the amount of %arg2%",
            specify: "Indicate what you want to deliver!",
            specify_quantity: "Specify the quantity you want to bet at least 1 and no more than 10M"
        }
    },
    shop: {
        command: {
            usage: "shop [Buy / Add / Remove] [Role]",
            description: " Role Store"
        },
        parameters: {
            already_store: "The role is already in the store",
            add_store: "The role was successfully added to the store",
            min_price: "Minimum price 1$",
            role_removed: "Role successfully removed from the store",
            no_in_store: "Roles are not in the store",
            you_have: "You have this role",
            add_you: "Role successfully added you!",
            no_available: "This role is not available in the store",
            store: "Store",
            none: "None",
            provide_role: "Provide role"
        }
    },
    avatar: {
        command: {
            usage: "avatar [User/ID]",
            description: "Show Avatar"
        },
        parameters: {
            avatar: "Avatar"
        }
    },
    cat: {
        command: {
            usage: "cat",
            description: "Show a random picture of a cat!"
        },
        parameters: {}
    },
    fox: {
        command: {
            usage: "fox",
            description: "Show a random picture of a fox!"
        },
        parameters: {
            successful: "Fox"
        }
    },
    giveaway: {
        command: {
            usage: "giveaway <add/Delete/End> <Time/ID of the message with the drawing> <winners> <prize>",
            description: "Allows to create / delete / end a giveaway"
        },
        parameters: {
            give_argument: "Give an argument: <add / delete / end>!",
            enter_time: "Enter the giveaway time!",
            enter_number: "Enter the number of winners!",
            giveaway: "Giveaway",
            enter_prize: "Provide prize!",
            giveaway_text: "**%Prize% **\n\nDraw time %Duration%\nWinners: %Winners%",
            over: "The giveaway is over!",
            winners: "Winners",
            no_winner: "No winner",
            no_data: "** This giveaway is not in the database **",
            successfully_deleted: "** Giveaway with number %id% successfully deleted **"
        }
    },
    hug: {
        command: {
            usage: "hug <User / ID>",
            description: "hug the user"
        },
        parameters: {
            successful: "hug"
        }
    },
    kiss: {
        command: {
            usage: "kiss <User / ID>",
            description: "Kiss the user"
        },
        parameters: {
            successful: "kissed"
        }
    },
    meme: {
        command: {
            usage: "meme",
            description: "Meme"
        },
        parameters: {
            successful: "Meme"
        }
    },
    pat: {
        command: {
            usage: "pat [User / ID]",
            description: "Pet the user or yourself"
        },
        parameters: {
            successful: "pats"
        }

    },
    poke: {
        command: {
            usage: "poke [User / ID]",
            description: "poke the user or yourself"
        },
        parameters: {
            successful: "poke"
        }

    },
    poll: {
        command: {
            usage: "poll <text>",
            description: "Allows you to create a mini vote"
        },
        parameters: {
            vote: "VOTE",
            specify_text: "Write what to vote for!"
        }
    },
    reverse: {
        command: {
            usage: "reverse <Text>",
            description: "Allows you to flip text"
        },
        parameters: {
            reverse_successful: "Enter what you want to reverse"
        }
    },
    roll: {
        command: {
            usage: "roll [Minimal number] [Maximum number]",
            description: "Allows to `make` a random number"
        },
        parameters: {
            big_numbers: "Please enter smaller numbers",
            result_text: "For numbers from `%num1%` to `%num2%`, you get: %random%"
        }
    },
    slap: {
        command: {
            usage: "slap [User / ID]",
            description: "Lets hit yourself or the user"
        },
        parameters: {
            slap_successful: "slap"
        }
    },
    ss: {
        command: {
            usage: "ss <url>",
            description: "Allows you to send a screenshot of the site"
        },
        parameters: {
            specify_link: "Did you forget the link :?",
            screenshot: "Screenshot"
        }
    },
    weather: {
        command: {
            usage: "weather <City>",
            description: "Find out the weather"
        },
        parameters: {}
    },
    bot_info: {
        command: {
            usage: "botinfo",
            description: "BotInfo"
        },
        parameters: {}
    },
    help: {
        command: {
            usage: "help [command]",
            description: "Allows you to view a list of commands or detailed information about a command"
        },
        parameters: {
            command_info: "NSFW: %nsfw%\nCategory: %category%\nAliases: %aliases%\nUsage: %usage%\ndescription: %description%"
        }
    },
    shards: {
        command: {
            usage: "shards",
            description: "Allows you to view a list of Shards and their parameters"
        }
        ,
        parameters: {
            shard: "Shard: %i%:\nUptime:%uptime%\nPing: %ping% ms\nCpu used: %cpu%\nMemory used: %memory%\nServers: %guilds%\nUsers: %user%\nChannels: %channels%\nEmoji: %emojis%"
        }
    },
    ban: {
        command: {
            usage: "ban <User / ID> [time]",
            description: "Allows you to ban a user"
        },
        parameters: {
            successfully_banned: "%user% successfully banned for **%days% ** day for **%reason% **",
            cant_ban: "I can't ban this member"
        }
    },
    clear: {
        command: {
            usage: "clear <amount>",
            description: "Allows you to delete posts in this channel"
        },
        parameters: {
            enter_number: "Enter a number between 1 and 100",
            message_removed: "%size% messages removed"
        }
    },
    kick: {
        command: {
            usage: "kick <User / ID>",
            description: "Allows you to kick a user"
        },
        parameters: {
            kicked: "%user% successfully kicked for **%reason% **",
            cant_kick: "I can't kick this member"
        }
    },
    mute: {
        command: {
            usage: "mute <User / ID> [time] [reason]",
            description: "Allows you to muddy the user forever or for a while"
        },
        parameters: {
            muted_text: "%member% muted by %time% for %reason%",
            forever: "Forever",
            no_time: "Specify mute time",
            muted: "%member% still muted by %time%"
        }
    },
    slow_mode: {
        command: {
            usage: "slowmode <time>",
            description: "Allows you to enable slow mode in the current channel"
        },
        parameters: {
            no_time: "Enter time",
            max_slow: "The maximum slow mode time is 6 hours",
            set_time: "Slow time in %channel% is set to `%args%`",
            only_text: "You only can set slow-mode in TextChannel"
        }
    },
    unmute: {
        command: {
            usage: "unmute <User / ID>",
            description: "Allows you to unmute a user"
        },
        parameters: {
            un_muted: "Unmuted!",
            not_muted: "Not muted!"
        }
    },
    unwarn: {
        command: {
            usage: "unwarn <User / ID>",
            description: "Allows you to take warn from the user"
        },
        parameters: {
            un_yourself: "You really wanna unwarn yourself, LOL?",
            already_zero: "This user already has 0 warnings, much less?",
            unwarn_successful: "Moderator: %moder% $\nIntruder: %member%\n\nWarnings: %warns%"
        }
    },
    warn: {
        command: {
            usage: "warn <User/ID> [Reason]",
            description: "Allows to issue warn to the user"
        },
        parameters: {
            warn_yourself: "You know that you want to brew yourself...",
            warn_successful: "Moderator: %moder%\nIntruder: %member%\nReason: %reason%\nWarnings: %warns%"
        }
    },
    leave: {
        command: {
            usage: "leave",
            description: "Bot stops playing music"
        },
        parameters: {
            no_voice: "You are not in the voice channel",
            no_my_voice: "You are not in the same voice channel where I am."
        }
    },
    pause: {
        command: {
            usage: "pause",
            description: "Pause music"
        },
        parameters: {
            already_paused: "The music has already paused",
            pause: "Pause"
        }
    },
    play: {
        command: {
            usage: "play <URL/Name>",
            description: "Lets play the song :)"
        },
        parameters: {
            no_arguments: "You did not specify a link or search mode",
            not_fined: "I didn't find anything in the query you gave me",
            add_playlist: "Added the playlist **%playlist%** in queue!",
            add_track: "Added the track **%track%** in queue!",
            request_tracks: "Tracks on request %query%",
            time_over: "Time is over"
        }
    },
    queue: {
        command: {
            usage: "queue",
            description: "View queue"
        },
        parameters: {
            queue: "Queue",
            current: "current"
        }
    },
    resume: {
        command: {
            usage: "resume",
            description: "Unpause music"
        },
        parameters: {
            not_paused: "Music is not paused",
            playing: "I keep playing %current%! "
        }
    },
    skip: {
        command: {
            usage: "skip",
            description: "Skip song"
        },
        parameters: {}
    },
    volume: {
        command: {
            usage: "volume <volume>",
            description: "Change volume"
        },
        parameters: {
            volume: "The playback volume is currently at **%volume% %**",
            no_dumb: "I am not as dumb as you think =3=",
            changed_volume: "The playback volume is now set to **%volume%%**"
        }
    },
    prefix: {
        command: {
            usage: "prefix <new prefix>",
            description: "Allows you to prefix"
        },
        parameters: {
            "successfully": "Prefix changed successfully",
            "member_successfully": "The prefix was successfully changed by %member% to `%args%`",
            "no_prefix": "Enter a new prefix"
        }
    },
    set_box: {
        command: {
            usage: "setbox <on/off>",
            description: "Allows to customize boxes"
        },
        parameters: {
            successful: "Successful set %arg%",
            already: "Already"
        }
    },
    server_info: {
        command: {
            usage: "",
            description: ""
        },
        parameters: {
            server_info: "Server info",
            server_info_text: "`Name/ID: %server_name% (\\`%server_id%\\`)\n               Owner: %owner% (\\`%owner_id%\\`)\n                VerificationLevel: \\`%verification_level%\\`\n                Region: \\`%region%\\`\n                System Channel: %system_channel%`",
            members: ""
        }
    },
}
export const events = {
    ready: {
        unmute: "Successfully unmuted",
        winners: "Winners",
        no_winners: "There are no winners"
    },
    message: {
        level_up: "Congratulations **%name% ** on leveling up:%level%",
        give_basic_law: "** Unfortunately I do not have the laws to `SEND MESSAGES`\nPlease give me this right, otherwise I'll be useless **",
        no_enough_laws: "** Sorry, %user% don't have enough laws: `%need%`\nI cannot obey your command. **",
        slow_mode: "Wait %time% before using again",
        prefix: "** Bot prefix: **",
        only_nsfw: "This command can only be used on channels with a NSFW tag"
    },
}
export const basically = {
    pages: "Page %page% of %pages%",
    no_music: "Nothing is playing in this guild.",
    bot: "**Error: Bots are not humans**",
    no_member: "User is not found. Indicate it by mentioning it.",
    no_money: "You do not have enough money!",
    noData: "This user is not in the database.!",
    no_args: "Provide parameters!",
    no_arg: "Provide %param%!",
    no_perms: "You do not have the right `%perms%`",
    undefined: "Unknown",
    no_voice: "You are not in a voice channel",
    no_me_voice: "You are not in the same voice channel where I am.",
    no_author: "You can't do it to yourself",
}
export const other = {
    Achievements: [
        [
            "🔰",
            "Новичок",
            "Начать пользоваться ботом",
            "Data"
        ],
        [
            "🐵",
            "!Бизнесмен",
            "Заработать первую 1.000 бабла",
            "Data.money >= 1000"
        ],
        [
            "📘",
            "Ученик",
            "Получить 5 уровень",
            "Data.level >= 5"
        ]
    ]
}