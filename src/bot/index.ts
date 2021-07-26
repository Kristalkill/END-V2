import 'module-alias/register';
import Client from './kernel/Client'
import { Config } from '@interfaces/Config'
import { HumanizeDuration, HumanizeDurationLanguage } from 'humanize-duration-ts'

export const humanizeDuration = new HumanizeDuration(new HumanizeDurationLanguage())
new Client().start(process.env as unknown as Config).then()

export * from '@kernel/Prototypes/Prototypes'
