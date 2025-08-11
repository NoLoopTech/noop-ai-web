import {
  IconLayoutDashboard,
  IconSettings,
  IconUsers,
  IconMessages,
  IconTicket,
  IconLink,
  IconAdjustmentsHorizontal,
  IconHeartHandshake,
  IconBuildingStore,
  IconReceiptDollar,
  IconChartHistogram,
  IconChartTreemap,
  IconUserDollar
} from "@tabler/icons-react"
import { AudioWaveform, GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { type SidebarData } from "@/types/sidebar"
import { Logo } from "@/components/Logo"

export const sidebarData: SidebarData = {
  user: {
    name: "ausrobdev",
    email: "rob@shadcnblocks.com",
    avatar: "/avatars/ausrobdev-avatar.png"
  },
  projects: [
    {
      name: "Shadcnblocks - Admin Kit",
      logo: ({ className }: { className: string }) => (
        <Logo className={cn("invert dark:invert-0", className)} />
      ),
      plan: "Nextjs + shadcn/ui"
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise"
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup"
    }
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          icon: IconLayoutDashboard,
          items: [
            {
              title: "Overview",
              url: "/overview",
              icon: IconChartTreemap
            },
            {
              title: "Analytics",
              url: "/analytics",
              icon: IconChartHistogram
            }
          ]
        },
        {
          title: "Chats",
          url: "/chats",
          icon: IconMessages
        },
        {
          title: "Tickets",
          url: "/tickets",
          icon: IconTicket
        },
        {
          title: "Leads",
          url: "/leads",
          icon: IconUserDollar
        },
        {
          title: "Integrations",
          url: "/integrations",
          icon: IconLink
        },
        {
          title: "Bot Settings",
          url: "/bot-settings",
          icon: IconAdjustmentsHorizontal
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          title: "Team & Membership",
          url: "/team",
          icon: IconUsers
        },
        {
          title: "Marketplace",
          url: "/marketplace",
          icon: IconBuildingStore
        },
        {
          title: "Plans & Billings",
          url: "/billings",
          icon: IconReceiptDollar
        }
      ]
    },
    {
      title: "Support Center",
      items: [
        {
          title: "Help & Support",
          url: "/settings",
          icon: IconHeartHandshake
        },
        {
          title: "Settings",
          url: "/settings",
          icon: IconSettings
        }
      ]
    }
  ]
}
