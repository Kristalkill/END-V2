import {
  DMChannel,
  Message,
  MessageEmbed,
  MessageEmbedOptions,
  NewsChannel,
  TextChannel
} from 'discord.js'
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
  public async basic(options: MessageEmbedOptions, channel: TextChannel | NewsChannel | DMChannel): Promise<Message> {
    if(["text","news"].includes(channel.type)){
      return await channel.send(new MessageEmbed({ ...options }).setFooter(`#6908 | END`,`https://cdn.discordapp.com/avatars/670034507025350661/4c29eb5847bcf88c66af6dbb34d3222c.png`).setTimestamp())
    }
  }

  public async okay(content: string, channel: TextChannel | NewsChannel | DMChannel): Promise<Message> {
    return this.basic({
      color: '#1bff02',
      title: 'OK',
      description: content
    }, channel)
  }

  public async error(content: string, channel: TextChannel | NewsChannel | DMChannel): Promise<Message> {
    return this.basic({
      color: '#f80404',
      title: 'Error',
      description: content
    }, channel)
  }

  public async fun (title: string, channel: TextChannel | NewsChannel | DMChannel, url?: string, description?: string): Promise<Message> {
    return this.basic({
      color: '#0054ff',
      title: title,
      description: description,
      image: {url}
    }, channel)
  }
}
