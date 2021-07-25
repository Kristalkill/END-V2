import Command from "@classes/Command";
import {Message, MessageEmbed} from "discord.js";
import {humanizeDuration} from "../../index";


export default class Reputation extends Command {
    async run(message: Message, [user_args, typed]: string[]): Promise<void | Message> {
        {
            const member = await this.member(message, user_args)
            if (this.stop) return null;
            const {time_no_come, up, down, have} = this.language.commands.rep.parameters
            const data = await this.get_data(message.guild.id, member.user.id)
            const embed = new MessageEmbed()
            if (message.member.options.time._rep > Date.now())
                await this.embed.error(time_no_come.translate({
                        time_no_come: humanizeDuration.humanize(message.member.options.time._rep - Date.now(), {
                            round: true, language: message.guild.settings.language || 'en'
                        })
                    })
                    , message);
            if (['remove', 'minus', '-'].includes(typed?.toLowerCase())) {
                data.Economy.rep--;
                embed.setTitle(up);
            } else {
                data.Economy.rep++;
                embed.setTitle(down);
            }
            embed.setDescription(have.translate({
                    name: member.user.username,
                    rep: data.Economy.rep,
                })
            );
            message.member.options.time._rep = Date.now() + 14400000;
            await this.client.db.save('users', data)
            await message.channel.send(embed);
        }
    }
}