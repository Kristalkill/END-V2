import {Message, MessageEmbed, MessageEmbedOptions} from 'discord.js'

export default class Embed {
    /* chunk(title, content) {
      if (content.length < 1024) {
        this.fields.push({
          name: title,
          value: content,
          inline: false
        });
      } else if (content.length > 1024 && content.length < 2048) {
        this.description = content;
      } else if (content.length > 2048) {
        content.chunk(1024).forEach((element) => {
          this.fields.push({
            name: '\u200b',
            value: element,
            inline: false
          });
        });
      }
      return this;
    }
     */
    async basic(options: MessageEmbedOptions, {guild: {me}, channel}: Message): Promise<Message> {
        return await channel.send(new MessageEmbed({...options}).setFooter(`${me.user.tag} | ${me.user.username}`, me.user.displayAvatarURL({
            format: 'png',
            dynamic: true
        })).setTimestamp())
    }

    async okay(content: string, message: Message): Promise<Message> {
        return this.basic({
            color: '#1bff02',
            title: 'OK',
            description: content
        }, message)
    }

    async error(content: string, message: Message): Promise<Message> {
        return this.basic({
            color: '#f80404',
            title: 'Error',
            description: content
        }, message)
    }

    async fun(title: string, message: Message, url?: string | null, description?: string): Promise<Message> {
        return this.basic({
            color: '#0054ff',
            title: title,
            description: description,
            image: {url}
        }, message)
    }
}
