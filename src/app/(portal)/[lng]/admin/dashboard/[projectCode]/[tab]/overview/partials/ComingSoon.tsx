import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon, IconProps } from "@tabler/icons-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

interface StatsProps {
  title: string
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
}

export default function ComingSoon({ title, icon: Icon }: StatsProps) {
  return (
    <Card className="col-span-3 h-full lg:col-span-2 xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
        <CardTitle className="flex w-full items-center justify-between text-sm font-medium">
          <p className="truncate">{title}</p>

          {Icon && <Icon size={16} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100%_-_48px)] flex-col justify-between py-2.5">
        <div className="flex h-full w-full items-center justify-center">
          <h3 className="text-muted-foreground text-lg font-semibold">
            Coming Soon
          </h3>
        </div>
      </CardContent>
    </Card>
  )
}
