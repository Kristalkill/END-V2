import Command from "@classes/Command";
import {Message} from "discord.js";


export default class Pay extends Command {
    async run(message: Message, [user_args, count]: string[]): Promise<void | Message> {
        const member = await this.member(message, user_args)
        if (this.stop) return null;
        const money = parseInt(count)
        if (!money || money < 1 || money > 10000000) return await this.embed.error(this.language.commands.pay.parameters.enter_valid_value, message)
        const data = await this.get_data(message.guild.id, member.id)
        if (message.member.options.Economy.money < money) return await this.embed.error(this.language.commands.pay.parameters.no_have_coins, message)
        message.member.options.Economy.money -= money;
        data.Economy.money += money;
        await this.client.db.save('users', data)
        await this.embed.okay(this.language.commands.pay.parameters.successfully_text.translate({
            member: member.user.username,
            author: message.author.username,
            args1: money,
        }), message)
    }
}