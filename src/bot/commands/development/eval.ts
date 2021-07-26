import { Message, MessageEmbed } from 'discord.js'
import Command from '@classes/Command'
import { inspect } from 'util'
import {command_return} from "@interfaces/Command";

export default class Eval extends Command {
    public basic = {
      aliases: ['e']
    }

    public settings = {
      community: false,
      category: 'development'
    }

    public async run ({channel, createdTimestamp}: Message, args: string[]): Promise<command_return> {
      const argument = args.join(' ')
      try {
          // eslint-disable-next-line no-eval
        let evaluated = await eval(argument)
        const type_evaluated = typeof evaluated
        const typo = type_evaluated[0].toUpperCase() + type_evaluated.slice(1)
        evaluated = inspect(evaluated, {depth: 0})
        if(evaluated === null){
            evaluated = `Empty response: ${evaluated}`
        }
        const embed = new MessageEmbed()
          .addField('Вход', `\`\`\`js\n${argument}\`\`\``)
          .addField(
            'Выход',
                    `\`\`\`js\nType: ${typo}\nDone for: ${
                        new Date().getTime() - createdTimestamp
                    }ms\`\`\``,
                    true
          )
        evaluated
          .chunk(999)
          .sort()
          .map((chunk: string) => embed.addField('** **', `\`\`\`js\n${chunk}\`\`\``))
        await channel.send(embed).then((msg) => msg.react('✅'))
        return;
      } catch (err) {
        const embed = new MessageEmbed()
          .addField('Вход', argument)
          .addField('Выход', `\`\`\`js\nError ❎\n${err}\`\`\``, true)
          channel.send(embed).then((msg) => msg.react('❎'))
          return;
      }
    }
}
