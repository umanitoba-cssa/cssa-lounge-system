import type { ServerPlugin } from "@tessellatepos/plugin-sdk/server";

export default function register(_plugin: ServerPlugin): void {
    // Authentication and tab APIs remain in the separate Express service.
}
