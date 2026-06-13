"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNav, type NavItem } from "@/lib/navigation";

const sidebarEase = [0.16, 1, 0.3, 1] as const;
const dashboardRoot = "/dashboard";

type Props = {
  open: boolean;
  isMobile?: boolean;
  onClose?: () => void;
};

export function Sidebar({ open, isMobile = false, onClose }: Props) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: sidebarEase }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-white/[0.06] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 pt-6 pb-5">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    <div className="absolute inset-0 rounded-lg bg-[#FF6600]/15" />
                    <Zap className="h-4 w-4 text-[#FF6600]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white tracking-tight">
                      Go FlashArch
                    </div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                      Panel
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col gap-0.5 px-3 pt-1 overflow-y-auto">
                {dashboardNav.map((item) => (
                  <MobileNavItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <motion.aside
      animate={{ width: open ? 256 : 0 }}
      transition={{ duration: 0.35, ease: sidebarEase }}
      className="relative self-stretch flex-shrink-0 overflow-hidden bg-[#1A1A1A] border-r border-white/[0.06]"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: sidebarEase }}
              className="flex items-center gap-3 px-5 pt-6 pb-5"
            >
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 rounded-lg bg-[#FF6600]/15" />
                <Zap className="h-4 w-4 text-[#FF6600]" />
              </div>
              <Link href="/">
                <div className="text-lg font-bold text-white tracking-tight">
                  Go FlashArch
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                  Panel
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pt-1">
          {dashboardNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              open={open}
              pathname={pathname}
            />
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}

function NavItem({
  item,
  open,
  pathname,
}: {
  item: NavItem;
  open: boolean;
  pathname: string;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = isNavItemActive(item, pathname);
  const [expanded, setExpanded] = useState(isActive);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25, ease: sidebarEase }}
        >
          <div
            className={cn(
              "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#FF6600]/10 text-[#FF6600]"
                : "text-white/60 hover:bg-white/[0.06] hover:text-white/85",
            )}
          >
            <Link
              href={item.href}
              className="flex flex-1 items-center gap-3 min-w-0"
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>

            {hasChildren && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setExpanded(!expanded);
                }}
                className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:text-white/70 transition-colors"
              >
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: sidebarEase }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {hasChildren && expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: sidebarEase }}
                className="overflow-hidden"
              >
                <div className="ml-4 mt-0.5 border-l border-white/[0.08] pl-2">
                  {item.children!.map((child) => {
                    const childActive = isNavItemActive(child, pathname);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                          childActive
                            ? "text-[#FF6600] font-medium"
                            : "text-white/45 hover:text-white/75",
                        )}
                      >
                        <span className="h-1 w-1 rounded-full shrink-0 bg-current opacity-50" />
                        <span className="truncate">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileNavItem({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose?: () => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = isNavItemActive(item, pathname);
  const [expanded, setExpanded] = useState(isActive);

  return (
    <div>
      <div
        className={cn(
          "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-[#FF6600]/10 text-[#FF6600]"
            : "text-white/60 hover:bg-white/[0.06] hover:text-white/85",
        )}
      >
        <Link
          href={item.href}
          onClick={onClose}
          className="flex flex-1 items-center gap-3 min-w-0"
        >
          <item.icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </Link>

        {hasChildren && (
          <button
            onClick={(e) => {
              e.preventDefault();
              setExpanded(!expanded);
            }}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded-md text-white/40 hover:text-white/70 transition-colors"
          >
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.25, ease: sidebarEase }}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: sidebarEase }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-0.5 border-l border-white/[0.08] pl-2">
              {item.children!.map((child) => {
                const childActive = isNavItemActive(child, pathname);
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors",
                      childActive
                        ? "text-[#FF6600] font-medium"
                        : "text-white/45 hover:text-white/75",
                    )}
                  >
                    <span className="h-1 w-1 rounded-full shrink-0 bg-current opacity-50" />
                    <span className="truncate">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const allNavHrefs = collectAllHrefs(dashboardNav);

function isNavItemActive(item: NavItem, pathname: string) {
  if (item.href === dashboardRoot) {
    return pathname === dashboardRoot;
  }

  if (item.children?.some((child) => isNavItemActive(child, pathname))) {
    return true;
  }

  if (pathname === item.href) return true;

  if (!pathname.startsWith(`${item.href}/`)) return false;

  const hasDeeperMatch = allNavHrefs.some((href) => {
    if (href === item.href) return false;
    if (!href.startsWith(item.href)) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  });

  return !hasDeeperMatch;
}

function collectAllHrefs(items: NavItem[]): string[] {
  const hrefs: string[] = [];
  for (const item of items) {
    hrefs.push(item.href);
    if (item.children) hrefs.push(...collectAllHrefs(item.children));
  }
  return hrefs;
}
