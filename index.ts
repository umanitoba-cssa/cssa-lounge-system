import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server";
import mountDB from './src/db/mountDB.ts';
import mountAPI from './src/api/mountAPI.ts';

export default function register(plugin: ServerPlugin): void {
    mountDB(plugin);
    mountAPI(plugin);
}
