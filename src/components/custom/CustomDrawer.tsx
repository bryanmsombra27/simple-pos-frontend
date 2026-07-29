import type { FC } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "#components/ui/drawer";
import { MenuIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface CustomDrawerProps {}
const CustomDrawer: FC<CustomDrawerProps> = ({}) => {
  return (
    <Drawer swipeDirection="left">
      <DrawerTrigger className="m-4">
        <MenuIcon
          className="cursor-pointer text-2xl"
          // width={40}
          // height={40}
        />
      </DrawerTrigger>
      <DrawerContent>
        <nav className="flex flex-col p-4 gap-5">
          <DrawerClose className="text-left">
            <Link
              to="/productos"
              className="[&.active]:font-bold"
            >
              Productos
            </Link>
          </DrawerClose>
          <DrawerClose className="text-left">
            <Link
              search={{ page: 1, search: "" }}
              to="/mostrador"
              className="[&.active]:font-bold"
            >
              Mostrador
            </Link>
          </DrawerClose>
          <DrawerClose className="text-left">
            <Link
              to="/ventas"
              className="[&.active]:font-bold"
            >
              Ventas
            </Link>
          </DrawerClose>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
