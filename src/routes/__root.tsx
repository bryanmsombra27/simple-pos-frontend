import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { RouterContext } from "../router";
import CustomDrawer from "#components/custom/CustomDrawer";
const RootLayout = () => (
  <>
    <CustomDrawer />

    <hr />

    <Outlet />

    <TanStackDevtools
      config={{ position: "bottom-right" }}
      plugins={[
        {
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
        {
          name: "TanStack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  </>
);

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
