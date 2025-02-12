'use client'

import Image from "next/image"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/components/ui/utils"

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="hidden md:block">
              <Image 
                src="/treat-yourself-logo.png"
                alt="Logo"
                width={120}
                height={40}
                priority
              />
            </Link>
            <div className="flex gap-6">
              <NavLink href="/" active>
                Home
              </NavLink>
              <NavLink href="/insights">
                Insights
              </NavLink>
              <NavLink href="/logs">
                Logs
              </NavLink>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
  active?: boolean
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "text-sm font-medium transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  )
}