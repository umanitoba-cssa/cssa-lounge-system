import { PluginColumnType } from "@tessellatepos/plugin-sdk";
import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server"

export type TabEntry = {
  id: number;
  balance_cents: number;
};

const mountDB = (plugin: ServerPlugin) => {
  plugin.register("database", {
    tables: [
      {
        name: "tabs",
        columns: [
          {
            name: "id",
            type: PluginColumnType.INTEGER,
            primaryKey: true,
            auto_increment: true
          },
          {
            name: "balance_cents",
            type: PluginColumnType.INTEGER,
          },
        ]
      }
    ]
  })
}

export default mountDB;