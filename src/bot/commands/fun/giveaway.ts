import Command from "@classes/Command";
import {Message, MessageEmbed, TextChannel} from "discord.js";
import ms from "ms";
import {humanizeDuration} from "../../index";
import {Giveaway_Interface} from "@interfaces/MongoDB";


export default class Giveaway extends Command {
    async run(message: Message, [command, number, count_winners, ...args]: string[]): Promise<void | Message> {
        try {
            const {
                give_argument,
                no_data,
                over,
                winners,
                no_winner,
                successfully_deleted,
                enter_time,
                enter_number,
                enter_prize,
                giveaway,
                giveaway_text
            } = this.language.commands.giveaway.parameters
            const subcommand = command?.toLowerCase()
            if (['add', 'end', 'delete'].includes(subcommand) === false) return this.embed.error(give_argument, message)
            else {
                if (['end', 'delete'].includes(subcommand)) {
                    const res = await this.client.db.getOne<Giveaway_Interface>('giveaways', {messageID: number})
                    if (!res) return this.embed.error(no_data, message)
                    const channel = message.guild.channels.cache.get(res.channelID) as TextChannel
                    if (!channel) return this.embed.error(`This channel doesn't exist`, message)
                    const giveaway_message = await channel?.messages.fetch(res.messageID)
                    if (!giveaway_message) return this.embed.error(`This message doesn't exist`, message)
                    if ('end' === subcommand) {
                        const users = giveaway_message.reactions.cache.get('🎉').users.cache.filter((user) => user.bot === false && giveaway_message.guild.members.cache.has(user.id)).random(res.winners)
                        let EmbedObject;
                        if (users.length > 0) EmbedObject = {
                            title: `**🎉${over}🎉**`,
                            description: `${winners} ${users
                                .map((user) => message.guild.members.cache.get(user.id))
                                .join('; ')}`
                        }
                        else EmbedObject = {
                            title: `**🎉${over}🎉**`,
                            description: no_winner
                        }
                        giveaway_message.edit(new MessageEmbed(EmbedObject))
                        return users.forEach(user => {
                            channel.send(`Congratulations, ${user}, you've won ${res.prize}`)
                        })
                    } else {
                        await this.embed.okay(successfully_deleted.translate({
                            id: res.messageID,
                        }), message)
                    }
                    await this.client.db.delete('giveaways', {
                        messageID: res.messageID,
                    })
                    this.client.db._giveaways.delete(res.messageID)
                    return;

                } else {
                    const duration = ms(number || `0s`)
                    if (duration < 1) return this.embed.error(enter_time, message)
                    if (!count_winners) return this.embed.error(enter_number, message)
                    if (args.length < 1) return this.embed.error(enter_prize, message)
                    return this.embed.basic({
                        title: `🎉**${giveaway}** 🎉`,
                        description: giveaway_text.translate({
                            Prize: args.join(' '),
                            Duration: humanizeDuration.humanize(duration, {language: 'en'}),
                            Winners: count_winners,
                        })
                    }, message).then((msg) => {
                        msg.react('🎉');
                        const giveaway_obj = {
                            guildID: msg.guild.id,
                            time: Date.now() + duration,
                            prize: args.join(' '),
                            winners: parseInt(count_winners) || 1,
                            messageID: msg.id,
                            channelID: msg.channel.id,
                        }
                        this.client.db.insert_one('giveaways', giveaway_obj)
                        this.client.db._giveaways.set(msg.id, giveaway_obj)
                    });
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}