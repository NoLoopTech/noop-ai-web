declare module "react-image-crop" {
  import * as React from "react"
  export interface Crop {
    unit?: "px" | "%"
    x?: number
    y?: number
    width?: number
    height?: number
    aspect?: number
  }
  export interface ReactCropProps {
    crop: Crop
    onChange: (crop: Crop) => void
    onComplete?: (crop: Crop) => void
    aspect?: number
    circularCrop?: boolean
    children?: React.ReactNode
  }
  export default class ReactCrop extends React.Component<ReactCropProps> {}
}
