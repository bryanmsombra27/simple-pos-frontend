import type { FC } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerSwipeHandle,
  DrawerTrigger,
} from "#components/ui/drawer";
import { Button } from "#components/ui/button";
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
              to="/"
              className="[&.active]:font-bold"
            >
              Home
            </Link>
          </DrawerClose>

          <Link
            to="/about"
            className="[&.active]:font-bold"
          >
            About
          </Link>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default CustomDrawer;
