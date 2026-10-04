import {
    PluginUIMountPoint,
    type FrontendPlugin,
} from "@tessellatepos/plugin-sdk";
import Login from "./components/login";

/**
 * Client entry. The frontend's PluginLoader import()s the built bundle
 * (dist/client.js) and calls this once with a FrontendPlugin. Each
 * `register("ui", …)` places a component at one of the host's mount points.
 * Every component receives `{ context }`: the cart, order, settings,
 * navigate, and this plugin's scoped API client.
 */
export default function register(plugin: FrontendPlugin) {
    plugin.register("ui", {
        mount: PluginUIMountPoint.CART_SIDEBAR,
        component: Login,
    });
}
