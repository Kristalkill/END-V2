import Command from "@classes/Command";
import {humanizeDuration} from "../../index";
import {Message} from "discord.js";

export default class Bonus extends Command {
    async run(message: Message): Promise<void | Message> {
        if (message.member.options.time._bonus > Date.now()) {
            const time = humanizeDuration.humanize(message.member.options.time._bonus - Date.now())
            return this.embed.error(this.language.commands.bonus.parameters.already_take.translate({time: time}), message)
        } else {
            message.member.options.time._bonus = Date.now() + 86400000;
            message.member.options.Economy.money += message.guild.settings.Economy.bonus;
            return this.embed.okay(this.language.commands.bonus.parameters.successful_text.translate({bonus: message.guild.settings.Economy.bonus}), message);
        }
    }
}