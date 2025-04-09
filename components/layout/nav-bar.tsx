import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { NavMobileControl } from "./nav-mobile-control";
import { PolkadotLogo } from "../ui/polkadot-logo";
import { ThemeToggle } from "./theme-toggle";
import { WalletSelect } from "../account/wallet-select";

export interface NavItem {
  title: string;
  href?: string;
  items?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: "Products",
    href: "/products",
    items: [
      { title: "Product 1", href: "#" },
      { title: "Product 2", href: "#" },
      { title: "Product 3", href: "#" },
    ],
  },
  {
    title: "Solutions",
    href: "/solutions",
    items: [
      { title: "Solution 1", href: "#" },
      { title: "Solution 2", href: "#" },
      { title: "Solution 3", href: "#" },
    ],
  },
  {
    title: "Resources",
    href: "/resources",
    items: [],
  },
];

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full px-2 sm:px-0">
      <div className="absolute inset-0 h-16 bg-gradient-to-b from-background via-background/50 to-background/0 backdrop-blur-sm -z-10" />
      <div className="container mx-auto flex h-16 items-center">
        <div className="flex w-full items-center justify-between md:justify-start">
            <div className="hidden md:flex md:flex-1 md:justify-center">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <WalletSelect />
            </div>
            </div>
        </div>
      </div>
    </header>
  );
}
