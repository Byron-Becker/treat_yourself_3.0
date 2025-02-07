import { ClerkProvider} from '@clerk/nextjs'
import { Footer } from '@/components/footer'
import { cn } from '@/components/ui/utils'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { NextProgress } from '@/components/next-progress'
import { ErrorBoundary } from '@/components/error-boundary'
import { Suspense } from 'react'
import './globals.css'

interface RootLayoutProps {
  children: React.ReactNode,
  className?: string
}

export default function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        </head>
        <body 
          className={cn(
            "min-h-[100dvh] flex flex-col bg-background",
            "px-safe-offset-x pb-safe-offset-bottom",
            "overscroll-y-none",
            "select-none",
            "touch-pan-y",
            className
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Skip to main content link for accessibility */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:z-50"
            >
              Skip to main content
            </a>

            
            <main 
              id="main-content"
              className="flex-1 flex flex-col relative overflow-y-auto"
              style={{ scrollBehavior: 'smooth' }}
            >
              {/* Progress bar for page loads */}

              <Suspense fallback={<div>Loading...</div>}>
                <NextProgress />
                {children}
              </Suspense>
              {/* Inner content wrapper */}
              <div className={cn(
                "flex-1 container mx-auto",
                "px-4 sm:px-6 lg:px-8",
                "pt-safe-offset-top pb-safe-offset-bottom",
                "mb-safe-offset-bottom"
              )}>
                <ErrorBoundary>
                  <Suspense fallback={<div>Loading...</div>}>
                    {children}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </main>

            <Footer className="flex-none z-40" />
            
            {/* Toast notifications */}
            <Toaster />
          </ThemeProvider>

          {/* Portal container for modals */}
          <div id="modal-root" />
        </body>
      </html>
    </ClerkProvider>
  )
}

// Add metadata
export const metadata = {
  title: {
    default: 'Your App Name',
    template: '%s | Your App Name',
  },
  description: 'Your app description',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export const themeConfig = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}