import { Card, CardContent } from "./ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { HexColorPicker, HexColorInput } from "react-colorful"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Card className="rounded-lg">
          <CardContent className="flex h-9 w-28 items-center justify-between space-x-2 py-0 pr-3.5 pl-2.5 uppercase">
            <div
              style={{ backgroundColor: color }}
              className="h-5 w-5 rounded-full border-[3px] border-zinc-300 p-2"
            />
            <p className="text-foreground text-sm font-medium">{color}</p>
          </CardContent>
        </Card>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={10}
        sticky="partial"
        className="flex h-72 w-60 flex-col items-center justify-center space-y-4 rounded-lg border border-zinc-300"
      >
        <HexColorPicker color={color} onChange={onChange} />
        <HexColorInput
          color={color}
          onChange={onChange}
          prefixed
          className="text-foreground w-48 rounded-md border border-zinc-300 py-1.5 text-center text-sm font-medium uppercase"
        />
      </PopoverContent>
    </Popover>
  )
}
