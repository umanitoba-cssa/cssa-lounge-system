import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server";
import mountDB, { TabEntry } from './src/db/mountDB.ts';
import { PluginApiMethod } from "@tessellatepos/plugin-sdk";

// Dummy types so we can see the databse working 
interface TabArrResponse {
    entries: TabEntry[];
}

interface TabResponse {
    entry: TabEntry;
}

export default function register(plugin: ServerPlugin): void {
    mountDB(plugin);
    // Authentication and tab APIs remain in the separate Express service.

    // Temporary endpoints to show that the tabs table works, to remove during proper API implementation
    plugin.register("api", {
        route: "/tab",
        method: PluginApiMethod.GET,
        handler: async (_req, ctx) => {
            const rows = (await ctx.db.table("tabs").find()) as TabEntry[];
            const entries = rows.sort((a, b) => b.id - a.id).slice(0, 50);
            return { body: { entries } satisfies TabArrResponse };
        },
    });

    plugin.register("api", {
        route: "/tab",
        method: PluginApiMethod.POST,
        handler: async (req, ctx) => {
            const tab = ctx.db.table("tabs");

            const entry = (await tab.insert({ balance_cents: 100 })) as TabEntry;

            return {
                status: 201,
                body: {
                    entry,
                } satisfies TabResponse,
            };
        }
    });
}
