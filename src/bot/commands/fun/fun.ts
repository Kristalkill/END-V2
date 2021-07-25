import {ImageCommand, RoleCommand} from "@classes/Abstracts/Fun";

export class dog extends ImageCommand {
    async getImage(): Promise<string> {
        return this.fetch("https://random.dog/woof.json")
    }

    getSuccessMessage(): string {
        return this.language.commands.dog.parameters.successful
    }
}

export class cat extends ImageCommand {
    async getImage(): Promise<string> {
        return this.fetch("https://some-random-api.ml/img/cat")
    }

    getSuccessMessage(): string {
        return this.language.commands.cat.parameters.successful
    }
}

export class fox extends ImageCommand {
    async getImage(): Promise<string> {
        return this.fetch("https://randomfox.ca/floof/")
    }

    getSuccessMessage(): string {
        return this.language.commands.fox.parameters.successful
    }
}

export class meme extends ImageCommand {
    async getImage(): Promise<string> {
        return this.fetch('https://meme-api.herokuapp.com/gimme')
    }

    getSuccessMessage(): string {
        return 'MEME'
    }
}

export class hug extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/hug')
    }

    getSuccessMessage(): string {
        return this.language.commands.hug.parameters.successful;
    }

}

export class kiss extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/kiss')
    }

    getSuccessMessage(): string {
        return this.language.commands.kiss.parameters.successful;
    }
}

export class pat extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/pat')
    }

    getSuccessMessage(): string {
        return this.language.commands.pat.parameters.successful;
    }
}

export class poke extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/poke')
    }

    getSuccessMessage(): string {
        return this.language.commands.pat.parameters.successful;
    }
}

export class slap extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/slap')
    }

    getSuccessMessage(): string {
        return this.language.commands.slap.parameters.successful;
    }
}

export class smug extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/smug')
    }

    getSuccessMessage(): string {
        return this.language.commands.smug.parameters.successful;
    }
}

export class tickle extends RoleCommand {
    getImage(): Promise<string> {
        return this.fetch('https://nekos.life/api/v2/img/smug')
    }

    getSuccessMessage(): string {
        return this.language.commands.smug.parameters.successful;
    }
}