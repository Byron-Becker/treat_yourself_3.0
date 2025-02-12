import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/components/ui/utils"

interface CourseCardProps {
  subject: string
  level: number
  title: string
  icon: React.ReactNode
  color: string
  href: string
  disabled?: boolean
}

export function CourseCard({ 
  subject, 
  level, 
  title, 
  icon, 
  color, 
  href, 
  disabled 
}: CourseCardProps) {
  const content = (
    <Card className={cn(
      "w-full transition-all",
      disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"
    )}>
      <CardContent className="p-6">
        <div className="mb-4">{icon}</div>
        <div className={cn("text-sm mb-2", color)}>
          {subject} · LEVEL {level}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button 
          variant="default" 
          className="w-full mt-4 bg-black text-white hover:bg-black/90 md:hidden"
          disabled={disabled}
        >
          {disabled ? 'Complete initial exam first' : 'Start lesson'}
        </Button>
      </CardContent>
    </Card>
  )

  if (disabled) {
    return content
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  )
}