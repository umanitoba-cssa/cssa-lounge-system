import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server";
import mountDB from './src/db/mountDB.ts';
import mountAPI from './src/api/mountApi.ts';

export default function register(plugin: ServerPlugin): void {
    mountDB(plugin);
    mountAPI(plugin);
}
