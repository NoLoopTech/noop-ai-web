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
      title: "Workspace",
      items: [
        {
          title: "Overview",
          url: "/overview",
          icon: IconLayoutDashboard
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
          title: "Analytics",
          url: "/analytics",
          icon: IconChartHistogram
        },
        {
          title: "Integrations",
          url: "/integrations",
          icon: IconLink,
          disabled: true
        },
        {
          title: "Bot Settings",
          icon: IconAdjustmentsHorizontal,
          items: [
            {
              title: "General",
              url: "/bot-settings/general"
            },
            {
              title: "Bot Behaviour",
              url: "/bot-settings/bot-behaviour",
              disabled: true
            },
            {
              title: "Chat Interface",
              url: "/bot-settings/chat-interface"
            },
            {
              title: "Data Sources",
              url: "/bot-settings/data-sources",
              disabled: true
            },
            {
              title: "Playground",
              url: "/bot-settings/playground",
              disabled: true
            }
          ]
        }
      ]
    },
    {
      title: "Management",
      items: [
        {
          title: "Team & Membership",
          url: "/team",
          icon: IconUsers,
          disabled: true
        },
        {
          title: "Marketplace",
          url: "/marketplace",
          icon: IconBuildingStore,
          disabled: true
        },
        {
          title: "Plans & Billings",
          url: "/billings",
          icon: IconReceiptDollar,
          disabled: true
        }
      ]
    },
    {
      title: "Support Center",
      items: [
        {
          title: "Help & Support",
          url: "/settings",
          icon: IconHeartHandshake,
          disabled: true
        },
        {
          title: "Settings",
          url: "/settings",
          icon: IconSettings,
          disabled: true
        }
      ]
    }
  ]
}
