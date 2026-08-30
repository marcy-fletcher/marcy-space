"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useState } from "react"
import {
  LogOutIcon,
  MenuIcon,
  MonitorIcon,
  MoonIcon,
  OrbitIcon,
  SettingsIcon,
  SunIcon,
  UserRoundIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About me" },
]

function NavigationLink({
  href,
  label,
  mobile = false,
  onNavigate,
}: {
  href: string
  label: string
  mobile?: boolean
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "font-medium tracking-wide uppercase transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        mobile
          ? "rounded-md px-3 py-2 text-base"
          : "border-b px-2 py-2 text-sm",
        isActive
          ? mobile
            ? "bg-muted text-foreground"
            : "border-foreground text-foreground"
          : mobile
            ? "text-muted-foreground"
            : "border-transparent text-muted-foreground hover:border-border"
      )}
    >
      {label}
    </Link>
  )
}

function UserMenu() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open user menu"
            className="rounded-full"
          />
        }
      >
        <Avatar>
          <AvatarImage
            src="https://placehold.co/80x80/png?text=M"
            alt="Marcy"
          />
          <AvatarFallback>M</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2">
            <span className="block text-sm font-medium text-foreground">
              Marcy
            </span>
            <span className="block truncate font-normal">
              hello@marcy.space
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/profile" />}>
            <UserRoundIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/settings" />}>
            <SettingsIcon />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme ?? "dark"}
            onValueChange={setTheme}
          >
            <DropdownMenuRadioItem value="light">
              <SunIcon />
              Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <MoonIcon />
              Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <MonitorIcon />
              System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] md:justify-normal lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <OrbitIcon className="size-5 shrink-0" aria-hidden="true" />
          <span className="truncate text-xs leading-none font-semibold tracking-wide uppercase sm:text-sm">
            Marcy&apos;s Space
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavigationLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-1 justify-self-end">
          <UserMenu />

          <Sheet
            open={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
          >
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Main site navigation
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <NavigationLink
                    key={item.href}
                    {...item}
                    mobile
                    onNavigate={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
