import Command from "@classes/Command";
import {Message} from "discord.js";


export default class Clear extends Command {

    async run(message: Message, [count]: string[]): Promise<void | Message> {
        if (message.channel.type !== "dm") {
            const {enter_number, message_removed} = this.language.commands.clear.parameters
            const amount = parseInt(count)
            if (1 > amount || amount > 99) return this.embed.error(enter_number, message)
            const list = await message.channel.messages.fetch({limit: amount})
            return message.channel.bulkDelete(list, true).then(messages => {
                this.embed.okay(message_removed.translate({size: messages.size}), message)
            })
        }
    }
}