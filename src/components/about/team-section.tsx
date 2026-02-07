"use client"

import { useTranslations } from "next-intl"
import { Users, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { teamMembers, type TeamMember } from "@/data/about"

interface TeamMemberCardProps {
  member: TeamMember
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="group text-center">
      {/* Avatar */}
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg group-hover:shadow-xl transition-shadow">
        {/* Placeholder avatar - can be replaced with actual images */}
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
          <User className="w-16 h-16 text-muted-foreground/50" />
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
      <p className="text-sm font-medium text-primary mb-2">{member.role}</p>
      <p className="text-sm text-muted-foreground leading-relaxed px-4">
        {member.bio}
      </p>
    </div>
  )
}

export interface TeamSectionProps {
  className?: string
}

export function TeamSection({ className }: TeamSectionProps) {
  const t = useTranslations("marketing.about.team")

  return (
    <section
      className={cn(
        "relative py-20 lg:py-28 overflow-hidden",
        className
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">

          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Team Grid */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
          {teamMembers.map((member) => (
            <div key={member.name} className="w-full max-w-[280px]">
              <TeamMemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
