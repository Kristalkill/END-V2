import Command from "@classes/Command";
import {Message, MessageEmbed} from "discord.js";
import {readdirSync} from "fs";

export default class help extends Command {
    async help(message: Message): Promise<void> {
        const pages: Map<number, MessageEmbed> = new Map();
        const {prefix, blocked_commands} = message.guild.settings
        let i = 1;
        const modules = readdirSync(`src/bot/Commands/`).filter((module) => module !== 'development')
        modules.forEach((module: string) => {
            const commands = this.client.commands.filter((cmd) => cmd.basic.category === module || blocked_commands.includes(cmd.basic.name)).map(
                (cmd: Command) => {
                    const {name} = cmd.basic
                    const description = this.language.commands[name]?.command.description ?? this.language.basically.undefined
                    return `**\`${prefix}${name}\`** - ${description}`
                }).join('\n')
            const emojis = {
                economy: '<a:Coin:756933210864353471>',
                fun: '<a:Tada:756936421763448935>',
                info: ':bookmark_tabs:',
                moder: '<a:Judge_hammer:756940860616081569>',
                music: '<a:Music_Note:756941238405562370>',
                setting: '<a:Gears:757211002826784841>',
            };
            const page = new MessageEmbed({
                title: `≫ ${emojis[module as keyof typeof emojis]} | ${module.capitalize()} ≪`,
                description: commands,
                footer: {
                    text: this.language.basically.pages.translate({
                        pages: modules.length,
                        page: i ?? 1,
                    })
                },
                color: 0xff5500
            })
            pages.set(i, page)
            ++i
        })
        await this.paginate(message, pages, [
            'rewind:756545499238236272',
            'arrow_left:756545499586101288',
            'smart_button:756545499460272311',
            'arrow_right:756545499393294368',
            'fast_forward:756545499539964144',
        ])
    }

    run(message: Message, [cmd_arg]: Array<null | string>): Promise<void | Message> {
        const cmd = cmd_arg?.toLowerCase();
        if (cmd) {
            const command = this.client.commands.find((c: Command) =>
                c.basic.name === cmd || c.basic.aliases.includes(cmd)
            );
            if (command && command.settings.public === true) {
                const {basic: {category, name, aliases,}, settings: {nsfw}} = command
                const command_language = this.language.commands[name]?.command
                return message.channel.send(
                    new MessageEmbed().setTitle(name).setDescription(
                        this.language.commands.help.parameters.command.translate({
                            nsfw: nsfw,
                            category: category,
                            aliases: aliases,
                            usage: command_language?.usage ?? this.language.basically.undefined,
                            description: command_language?.description ?? this.language.basically.undefined,
                        })
                    )
                );
            } else return this.help(message);
        } else return this.help(message)
    }
}