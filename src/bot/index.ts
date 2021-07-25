require("module-alias/register");
import Client from './kernel/Client';
import {Config} from '@interfaces/config'
import {HumanizeDuration, HumanizeDurationLanguage} from "humanize-duration-ts";

export const humanizeDuration = new HumanizeDuration(new HumanizeDurationLanguage())
void new Client().start(process.env as unknown as Config)

export * from '@kernel/Prototypes/Prototypes'

