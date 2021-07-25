import Command from "@classes/Command";
import {Message} from "discord.js";
import {Block_Interface} from "@interfaces/MongoDB";


export default class Block extends Command {
    settings = {
        public: false,
    }

    async run(message: Message, [user, ...args]: string[]): Promise<void | Message> {
        const member = await this.member(message, user)
        if (this.stop === true) return null;
        const reason = args.slice(1).join(' ') || this.language.commands.block.parameters.Unknown;
        const Data = await this.client.db.getOne<Block_Interface>("Block", {id: member.id});
        if (Data) return this.embed.error(this.language.commands.block.parameters.already_blocked.translate({
                member, reason: Data.reason
            }
        ), message)
        await this.client.db.insert_one<Block_Interface>("Block", {
            id: member.id,
            reason
        });
        return this.embed.okay(this.language.commands.block.parameters.successful_text.translate({
            member,
            reason
        }), message)
    }
}