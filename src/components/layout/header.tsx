"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle, LanguageSwitcher, UserAvatarMenu, UserMenuList, getUserInitials } from "@/components/shared";
import { siteConfig } from "@/data/site";
import { locales } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth";

export interface NavItem {
  label: string;
  href: string;
  labelKey?: string;
}

export interface HeaderProps {
  logo?: {
    text: string;
    icon?: string;
    href?: string;
  };
  navItems?: NavItem[];
  ctaButton?: {
    label: string;
    href: string;
    showIcon?: boolean;
  };
  loginButton?: {
    label: string;
    href: string;
  };
}

export function Header({
  logo = { text: siteConfig.name, icon: "A", href: "/" },
}: HeaderProps) {
  const t = useTranslations("marketing.nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const normalizedPathname = (() => {
    if (!pathname) return "/";

    // Strip query/hash defensively (shouldn't exist on pathname but keeps this robust)
    const raw = pathname.split("#")[0]?.split("?")[0] ?? "/";

    // Remove trailing slash (except root)
    const noTrailing = raw !== "/" ? raw.replace(/\/+$/, "") : "/";

    // Remove locale prefix when present (e.g. /en/pricing -> /pricing)
    const parts = noTrailing.split("/").filter(Boolean);
    const first = parts[0];
    if (first && (locales as readonly string[]).includes(first)) {
      const rest = parts.slice(1).join("/");
      return rest ? `/${rest}` : "/";
    }

    return noTrailing;
  })();

  const isActiveHref = (href: string) => {
    const normalizedHref = href !== "/" ? href.replace(/\/+$/, "") : "/";
    if (normalizedHref === "/") return normalizedPathname === "/";
    return (
      normalizedPathname === normalizedHref ||
      normalizedPathname.startsWith(`${normalizedHref}/`)
    );
  };

  // Build nav items with translations
  const navItems: NavItem[] = [
    { label: t("homepage"), href: "/" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  const ctaButton = {
    label: t("getStarted"),
    href: "/register",
    showIcon: true,
  };
  const loginButton = { label: t("login"), href: "/login" };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg shadow-primary/5 border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href={logo.href || "/"}
              className="flex items-center gap-2 group"
            >
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt={logo.text}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-bold text-xl text-primary">
                {logo.text}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors group rounded-lg",
                    isActiveHref(item.href)
                      ? "text-primary"
                      : "text-foreground hover:text-primary",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary transition-all duration-300",
                      isActiveHref(item.href) ? "w-3/4" : "w-0 group-hover:w-3/4",
                    )}
                  />
                </Link>
              ))}
            </nav>

            {/* CTA Buttons / Avatar */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <ModeToggle />
              {isAuthenticated ? (
                <UserAvatarMenu showDashboardLink />
              ) : (
                <>
                  <Button
                    variant={isActiveHref(loginButton.href) ? "secondary" : "ghost"}
                    asChild
                  >
                    <Link href={loginButton.href}>{loginButton.label}</Link>
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={cn(
                        isActiveHref(ctaButton.href) && "ring-2 ring-primary/30",
                      )}
                      asChild
                    >
                      <Link
                        href={ctaButton.href}
                        className="flex items-center gap-1"
                      >
                        {ctaButton.label}
                        {ctaButton.showIcon && <ChevronRight className="w-4 h-4" />}
                      </Link>
                    </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-primary-50 dark:hover:bg-primary-900"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="bg-background/98 backdrop-blur-lg shadow-xl border-b border-border mx-4 rounded-2xl mt-2 overflow-hidden">
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block px-4 py-3 rounded-xl transition-colors font-medium",
                        isActiveHref(item.href)
                          ? "text-primary bg-primary-50 dark:bg-primary-900/40"
                          : "text-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-900",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-border mt-2 pt-4 flex flex-col gap-2">
                  <div className="flex justify-center gap-2 mb-2">
                    <LanguageSwitcher />
                    <ModeToggle />
                  </div>
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3 px-4 py-2 mb-1">
                        <Avatar className="h-10 w-10">
                          {user?.avatarUrl && (
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                          )}
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground truncate">
                          {user?.fullName ?? user?.email ?? "User"}
                        </span>
                      </div>
                      <UserMenuList
                        showDashboardLink
                        onItemClick={() => setIsMobileMenuOpen(false)}
                      />
                    </div>
                  ) : (
                    <>
                      <Button
                        variant={isActiveHref(loginButton.href) ? "secondary" : "ghost"}
                        className="justify-center"
                        asChild
                      >
                        <Link href={loginButton.href}>{loginButton.label}</Link>
                      </Button>
                      <Button
                        className={cn(
                          "justify-center",
                          isActiveHref(ctaButton.href) && "ring-2 ring-primary/30",
                        )}
                        asChild
                      >
                        <Link
                          href={ctaButton.href}
                          className="flex items-center justify-center gap-1"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {ctaButton.label}
                          {ctaButton.showIcon && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
