import { ImageCommand, RoleCommand } from '@classes/Abstracts/Fun'

export class dog extends ImageCommand {
  protected async getImage (): Promise<string> {
    return this.fetch('https://random.dog/woof.json')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.dog.parameters.successful
  }
}
export class cat extends ImageCommand {
  protected async getImage (): Promise<string> {
    return this.fetch('https://some-random-api.ml/img/cat')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.cat.parameters.successful
  }
}

export class fox extends ImageCommand {
  protected async getImage (): Promise<string> {
    return this.fetch('https://randomfox.ca/floof/')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.fox.parameters.successful
  }
}

export class meme extends ImageCommand {
  protected async getImage (): Promise<string> {
    return this.fetch('https://meme-api.herokuapp.com/gimme')
  }

  protected getSuccessMessage (): string {
    return 'MEME'
  }
}

export class hug extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/hug')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.hug.parameters.successful
  }
}

export class kiss extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/kiss')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.kiss.parameters.successful
  }
}

export class pat extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/pat')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.pat.parameters.successful
  }
}

export class poke extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/poke')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.pat.parameters.successful
  }
}

export class slap extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/slap')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.slap.parameters.successful
  }
}

export class smug extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/smug')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.smug.parameters.successful
  }
}

export class tickle extends RoleCommand {
  protected getImage (): Promise<string> {
    return this.fetch('https://nekos.life/api/v2/img/smug')
  }

  protected getSuccessMessage (): string {
    return this.language.commands.smug.parameters.successful
  }
}
