import {Message, MessageEmbed} from "discord.js";
import Command from "@classes/Command";
import {inspect} from "util";

export default class Eval extends Command {
    basic = {
        aliases: ['e']
    }
    settings = {
        public: false,
        category: 'development',
    }

    async run(message: Message, args: string[]) {
        const argument = args.join(' ');
        try {
            let evaluated = await eval(argument);
            const type_evaluated = typeof evaluated;
            const typo = type_evaluated[0].toUpperCase() + type_evaluated.slice(1);
            if (typeof evaluated !== 'string')
                evaluated = inspect(evaluated, {depth: 0});
            evaluated === null
                ? (evaluated = `Empty response: ${evaluated}`)
                : evaluated;
            const embed = new MessageEmbed()
                .addField('Вход', `\`\`\`js\n${argument}\`\`\``)
                .addField(
                    'Выход',
                    `\`\`\`js\nType: ${typo}\nDone for: ${
                        new Date().getTime() - message.createdTimestamp
                    }ms\`\`\``,
                    true
                );
            evaluated
                .chunk(999)
                .sort()
                .map((chunk: string) => {
                    embed.addField('** **', `\`\`\`js\n${chunk}\`\`\``);
                });
            await message.channel.send(embed).then(() => message.react('✅'));
        } catch (err) {
            const embed = new MessageEmbed()
                .addField('Вход', argument)
                .addField('Выход', `\`\`\`js\nError ❎\n${err}\`\`\``, true);
            message.channel.send(embed).then(() => message.react('❎'));
        }
    }
}
