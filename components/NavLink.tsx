"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type NavLinkCompatProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className"
> &
  LinkProps & {
    className?: string;
    activeClassName?: string;
    pendingClassName?: string; // kept for compatibility (not used in Next router)
    exact?: boolean; // if true, only active on exact match
  };

const normalizePath = (p: string) => {
  if (!p) return "/";
  // remove trailing slash except for root
  return p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p;
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName, // eslint-disable-line @typescript-eslint/no-unused-vars
      exact = false,
      href,
      ...props
    },
    ref
  ) => {
    const pathname = usePathname();

    const current = normalizePath(pathname || "/");
    const target =
      typeof href === "string"
        ? normalizePath(href)
        : normalizePath(href.pathname || "/");

    const isActive = exact ? current === target : current === target || current.startsWith(`${target}/`);

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
