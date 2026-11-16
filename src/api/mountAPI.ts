import type { TabArrResponse, TabEntry, TabResponse } from "@/db/mountDB";
import { PluginApiMethod } from "@tessellatepos/plugin-sdk";
import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server";

const mountAPI = (plugin: ServerPlugin) => {

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
        handler: async (_, ctx) => {
            const tab = ctx.db.table("tabs");

            const new_entry = {
                name: "Test McTesterson",
                email: "test@test.com" + Math.floor(Math.random() * 1000),
                created_at: new Date(),
                updated_at: new Date()
            } as TabEntry;

            const entry = (await tab.insert(new_entry)) as TabEntry;

            return {
                status: 201,
                body: {
                    entry,
                } satisfies TabResponse,
            };
        }
    });
}

export default mountAPI;