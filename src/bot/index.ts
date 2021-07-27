import 'module-alias/register';
import {Config} from "@interfaces/Config";
import Client from "@kernel/Client";

new Client().start(process.env as Config).then(ready => console.log(ready))
