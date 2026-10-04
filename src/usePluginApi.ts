import { useEffect, useState } from "react";
import {
    PluginApiMethod,
    type PluginApiClient,
} from "@tessellatepos/plugin-sdk";

export type ApiState<T> =
    | { status: "loading" }
    | { status: "ok"; data: T }
    | { status: "error"; message: string };

/**
 * Calls one of this plugin's own API mounts when the component mounts (and
 * again if the route changes). Pass `null` as the route to skip the call.
 *
 * `context.api` can only reach routes under /plugins/<this plugin>/ — the
 * host scopes it, so a plugin can't call another plugin's routes.
 */
export function usePluginApi<T>(
    api: PluginApiClient,
    route: string | null,
    method: PluginApiMethod = PluginApiMethod.GET,
): ApiState<T> {
    const [state, setState] = useState<ApiState<T>>({ status: "loading" });

    useEffect(() => {
        if (!route) return;
        let cancelled = false;
        api.call<T>(route, method).then(
            (data) => {
                if (!cancelled) setState({ status: "ok", data });
            },
            (err: unknown) => {
                if (!cancelled)
                    setState({
                        status: "error",
                        message:
                            err instanceof Error ? err.message : String(err),
                    });
            },
        );
        return () => {
            cancelled = true;
        };
    }, [api, route, method]);

    return state;
}
