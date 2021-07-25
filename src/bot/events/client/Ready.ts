import {Event_Run} from "@interfaces/Event";
import Event from "@classes/Event";
import {ClientEvents, MessageEmbed, TextChannel} from "discord.js";
import {Giveaway_Interface, Guild_Interface, Mute_Interface} from "@interfaces/MongoDB";

export default class ready extends Event {
    public name: keyof ClientEvents = 'ready';
    public run: Event_Run = async () => {
        await this.client.user.setPresence({
            activity: {
                name: 'k!help'
            },
            status: 'online',
        });
        this.client.db._giveaways = new Map((await this.client.db.getMany<Giveaway_Interface>('giveaways')).map(x => {
            return [x.messageID, x]
        }))
        this.client.db._mutes = new Map((await this.client.db.getMany<Mute_Interface>('mutes')).map(x => {
            return [`${x.guildID}${x.userID}`, x]
        }))
        setInterval(async () => {
            for (const [index, {guildID, channelID, messageID, time, winners, prize}] of this.client.db.giveaways) {
                const guild = this.client.guilds.cache.get(guildID);
                if (!guild) continue;
                const {language} = await this.client.db.getOne<Guild_Interface>('guilds', {
                    guildID: guildID,
                });
                const channel = guild.channels.cache.get(channelID) as TextChannel
                const message = await channel?.messages.fetch(messageID)
                if (!channel || !message) {
                    await this.client.db.delete('giveaways', {messageID: messageID})
                    this.client.db._giveaways.delete(index)
                    return;
                } else if (time <= Date.now()) {
                    const {over, no_winner} = (await this.language(language)).commands.giveaway.parameters;
                    const members = message.reactions.cache.get('🎉').users.cache.filter((user) => user.bot === false && guild.members.cache.has(user.id)).random(winners)
                    let EmbedObject;
                    if (members.length > 0) EmbedObject = {
                        title: `**🎉${over}🎉**`,
                        description: `${winners} ${members
                            .map((user) => guild.members.cache.get(user.id))
                            .join('; ')}`
                    }
                    else EmbedObject = {
                        title: `**🎉${over}🎉**`,
                        description: no_winner
                    }
                    message.edit(new MessageEmbed(EmbedObject))
                    members.forEach(user => {
                        channel.send(`Congratulations, ${user}, you've won ${prize}`)
                    })
                    await this.client.db.delete('giveaways', {messageID: messageID})
                    return this.client.db._giveaways.delete(index)

                }
            }
            for (const [index, {time, guildID, userID, channelID}] of this.client.db.mutes) {
                const guild = this.client.guilds.cache.get(guildID);
                if (!guild) continue;
                const {Moderation: {mute_role}, language} = await this.client.db.getOne<Guild_Interface>('guilds', {
                    guildID: guildID,
                });
                const role = guild.roles.cache.get(mute_role);
                const user = guild.members.cache.get(userID);
                if (time <= Date.now() || !role) {
                    if (user && user.roles.cache.has(mute_role) === true) {
                        const {un_muted} = (await this.language(language)).commands.unmute.parameters;
                        await user.roles.remove(mute_role);
                        const channel = guild.channels.cache.get(channelID) as TextChannel
                        if (channel) return await this.client.embed.okay(`${user} ${un_muted}`, (await channel.messages.fetch()).first())
                    }
                    await this.client.db.delete('mutes', {userID: userID, guildID: guildID})
                    this.client.db._mutes.delete(index)
                } else if (time >= Date.now() && user.roles.cache.has(mute_role) === false) {
                    await user.roles.add(mute_role)
                }
            }
        }, 3000)
    }
}