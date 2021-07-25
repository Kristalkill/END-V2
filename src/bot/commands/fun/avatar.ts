import {Message, MessageEmbed} from 'discord.js';
import Command from "@classes/Command";

export default class Avatar extends Command {
    async run(message: Message, [user]: string[]): Promise<void | Message> {
        const member = await this.member(message, user) || message.member
        if (this.stop === true) return;
        await message.channel.send(new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${this.language.commands.avatar.parameters.avatar} ${member.user.username}!`)
            .setImage(member.user.avatarURL({
                dynamic: true
            }))
            .setTimestamp());
    }
}