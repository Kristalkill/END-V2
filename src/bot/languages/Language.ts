interface command {
    command: {
        usage: string
        description: string
    }
    parameters: Record<any, any>
}

export default interface Language {
    commands: Record<any, command>
    events: Record<any, Record<any, any>>
    basically: Record<any, any>
    other: Record<any, any>
}