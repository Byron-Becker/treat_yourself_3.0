export function Footer({ className }: { className?: string }) {
  return (
    <footer className={className}>
      {/* Add your footer content here */}
      <div className="container mx-auto py-4">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company Name
        </p>
      </div>
    </footer>
  )
} 