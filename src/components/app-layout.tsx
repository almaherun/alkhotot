"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Menu,
  UploadCloud,
  Library,
  PenSquare,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/upload", icon: UploadCloud, label: "أضف خط جديد" },
    { href: "/", icon: Library, label: "مكتبتي" },
    { href: "/try", icon: PenSquare, label: "جرب الخطوط" },
    { href: "/view", icon: Eye, label: "رؤية الخطوط" },
  ];

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string; }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
          isActive ? "bg-muted text-primary" : ""
        }`}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  };
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-l md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <FileText className="h-6 w-6 text-primary" />
              <span className="">TypeSet</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map(item => <NavLink key={item.href} {...item} />)}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader className="mb-4 text-left">
                <SheetTitle>
                   <Link href="/" className="flex items-center gap-2 font-semibold">
                     <FileText className="h-6 w-6 text-primary" />
                     <span>TypeSet</span>
                   </Link>
                </SheetTitle>
                <SheetDescription>
                  Upload, preview, and manage your fonts with ease.
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-2 text-lg font-medium">
                {navItems.map(item => <NavLink key={item.href} {...item} />)}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search here if needed */}
          </div>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
