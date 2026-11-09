import { PluginColumnType } from "@tessellatepos/plugin-sdk";
import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server"

export type TabEntry = {
  id: number;
  name: string;
  email: string;
  discord_id?: string;
  microsoft_id?: string;
  tab_amount: number; // Stored in cents
  created_at: Date;
  updated_at: Date;
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
            name: "name",
            type: PluginColumnType.VARCHAR,
            length: 255,
            nullable: false,
          },
          {
            name: "email",
            type: PluginColumnType.VARCHAR,
            length: 255,
            unique: true,
            nullable: false,
          },
          {
            name: "discord_id",
            type: PluginColumnType.VARCHAR,
            length: 255,
            nullable: true,
            unique: true,
          },
          {
            name: "microsoft_id",
            type: PluginColumnType.VARCHAR,
            length: 255,
            nullable: true,
            unique: true,
          },
          {
            name: "tab_amount",
            type: PluginColumnType.INTEGER,
            nullable: false,
            default: 0
          },
          {
            name: "created_at",
            type: PluginColumnType.TIMESTAMP,
            nullable: false,
            // default: new Date() // TODO: How do we set this to default to the current time?
          },
          {
            name: "updated_at",
            type: PluginColumnType.TIMESTAMP,
            nullable: false,
            // default: new Date()
          },
        ]
      }
    ]
  })
}

export default mountDB;