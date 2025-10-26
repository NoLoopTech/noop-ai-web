"use client"

import { Button } from "@/components/ui/button"
import { CropIcon, RotateCcwIcon } from "lucide-react"
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type PercentCrop,
  type PixelCrop,
  type ReactCropProps
} from "react-image-crop"
import { cn } from "@/lib/utils"

import "react-image-crop/dist/ReactCrop.css"
import { Slot } from "@radix-ui/react-slot"

const centerAspectCrop = (
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined
): PercentCrop =>
  centerCrop(
    aspect
      ? makeAspectCrop(
          {
            unit: "%",
            width: 100
          },
          aspect,
          mediaWidth,
          mediaHeight
        )
      : { x: 0, y: 0, width: 100, height: 100, unit: "%" },
    mediaWidth,
    mediaHeight
  )

const getCroppedPngImage = async (
  imageSrc: HTMLImageElement,
  scaleFactor: number,
  pixelCrop: PixelCrop,
  maxImageSize: number,
  outputSize: { width: number; height: number }
): Promise<string> => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Context is null, this should never happen.")
  }

  const scaleX = imageSrc.naturalWidth / imageSrc.width
  const scaleY = imageSrc.naturalHeight / imageSrc.height

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"

  const canvasWidth = outputSize.width || pixelCrop.width
  const canvasHeight = outputSize.height || pixelCrop.height

  // INFO: Add this debug log back in if needed to troubleshoot image cropped size issues
  // eslint-disable-next-line no-console
  console.log("Final canvas dimensions:", {
    canvasWidth,
    canvasHeight,
    outputSize
  })

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  ctx.drawImage(
    imageSrc,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    canvasWidth,
    canvasHeight
  )

  const croppedImageUrl = canvas.toDataURL("image/png")
  const response = await fetch(croppedImageUrl)
  const blob = await response.blob()

  if (blob.size > maxImageSize) {
    return await getCroppedPngImage(
      imageSrc,
      scaleFactor * 0.9,
      pixelCrop,
      maxImageSize,
      outputSize
    )
  }

  return croppedImageUrl
}

type ImageCropContextType = {
  file: File
  maxImageSize: number
  outputSize: { width: number; height: number }
  imgSrc: string
  crop: PercentCrop | undefined
  completedCrop: PixelCrop | null
  imgRef: RefObject<HTMLImageElement | null>
  onCrop?: (croppedImage: string) => void
  reactCropProps: Omit<ReactCropProps, "onChange" | "onComplete" | "children">
  handleChange: (pixelCrop: PixelCrop, percentCrop: PercentCrop) => void
  handleComplete: (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop
  ) => Promise<void>
  onImageLoad: (e: SyntheticEvent<HTMLImageElement>) => void
  applyCrop: () => Promise<void>
  resetCrop: () => void
}

const ImageCropContext = createContext<ImageCropContextType | null>(null)

const useImageCrop = () => {
  const context = useContext(ImageCropContext)
  if (!context) {
    throw new Error("ImageCrop components must be used within ImageCrop")
  }
  return context
}

export type ImageCropProps = {
  file: File
  maxImageSize?: number
  outputSize: { width: number; height: number }
  onCrop?: (croppedImage: string) => void
  children: ReactNode
  onChange?: ReactCropProps["onChange"]
  onComplete?: ReactCropProps["onComplete"]
} & Omit<ReactCropProps, "onChange" | "onComplete" | "children">

export const ImageCrop = ({
  file,
  maxImageSize = 1024 * 1024 * 50,
  outputSize,
  onCrop,
  children,
  onChange,
  onComplete,
  ...reactCropProps
}: ImageCropProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imgSrc, setImgSrc] = useState<string>("")
  const [crop, setCrop] = useState<PercentCrop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null)
  const [initialCrop, setInitialCrop] = useState<PercentCrop>()

  // useEffect(() => {
  //   const reader = new FileReader()
  //   reader.addEventListener("load", () =>
  //     setImgSrc(reader.result?.toString() || "")
  //   )
  //   reader.readAsDataURL(file)
  // }, [file])

  useEffect(() => {
    if (!file) {
      setImgSrc("")
      return
    }

    const reader = new FileReader()
    reader.addEventListener("load", () =>
      setImgSrc(reader.result?.toString() || "")
    )
    reader.readAsDataURL(file)
  }, [file])

  const onImageLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget
      const newCrop = centerAspectCrop(width, height, reactCropProps.aspect)
      setCrop(newCrop)
      setInitialCrop(newCrop)
    },
    [reactCropProps.aspect]
  )

  const handleChange = (pixelCrop: PixelCrop, percentCrop: PercentCrop) => {
    setCrop(percentCrop)
    onChange?.(pixelCrop, percentCrop)
  }

  const handleComplete = async (
    pixelCrop: PixelCrop,
    percentCrop: PercentCrop
  ) => {
    setCompletedCrop(pixelCrop)
    onComplete?.(pixelCrop, percentCrop)
  }

  const applyCrop = async () => {
    if (!(imgRef.current && completedCrop)) {
      return
    }

    const croppedImage = await getCroppedPngImage(
      imgRef.current,
      1,
      completedCrop,
      maxImageSize,
      outputSize
    )

    onCrop?.(croppedImage)
  }

  const resetCrop = () => {
    if (initialCrop) {
      setCrop(initialCrop)
      setCompletedCrop(null)
    }
  }

  const contextValue: ImageCropContextType = {
    file,
    maxImageSize,
    outputSize,
    imgSrc,
    crop,
    completedCrop,
    imgRef,
    onCrop,
    reactCropProps,
    handleChange,
    handleComplete,
    onImageLoad,
    applyCrop,
    resetCrop
  }

  return (
    <ImageCropContext.Provider value={contextValue}>
      {children}
    </ImageCropContext.Provider>
  )
}

export type ImageCropContentProps = {
  style?: CSSProperties
  className?: string
}

export const ImageCropContent = ({
  style,
  className
}: ImageCropContentProps) => {
  const {
    imgSrc,
    crop,
    handleChange,
    handleComplete,
    onImageLoad,
    imgRef,
    reactCropProps
  } = useImageCrop()

  const shadcnStyle = {
    "--rc-border-color": "var(--color-border)",
    "--rc-focus-color": "var(--color-primary)"
  } as CSSProperties

  return (
    <ReactCrop
      className={cn("max-h-[277px] max-w-full", className)}
      crop={crop}
      onChange={handleChange}
      onComplete={handleComplete}
      style={{ ...shadcnStyle, ...style }}
      {...reactCropProps}
    >
      {imgSrc && (
        // INFO: Using img element instead of Next.js Image component due to canvas drawImage security issues
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt="crop"
          className="size-full"
          onLoad={onImageLoad}
          ref={imgRef}
          src={imgSrc}
        />
      )}
    </ReactCrop>
  )
}

export type ImageCropApplyProps = ComponentProps<"button"> & {
  asChild?: boolean
}

export const ImageCropApply = ({
  asChild = false,
  children,
  onClick,
  ...props
}: ImageCropApplyProps) => {
  const { applyCrop } = useImageCrop()

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    await applyCrop()
    onClick?.(e)
  }

  if (asChild) {
    return (
      <Slot onClick={handleClick} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <Button
      onClick={handleClick}
      type="button"
      size="sm"
      variant="outline"
      {...props}
    >
      {children ?? <CropIcon className="size-4" />} <span>Apply</span>
    </Button>
  )
}

export type ImageCropResetProps = ComponentProps<"button"> & {
  asChild?: boolean
}

export const ImageCropReset = ({
  asChild = false,
  children,
  onClick,
  ...props
}: ImageCropResetProps) => {
  const { resetCrop } = useImageCrop()

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    resetCrop()
    onClick?.(e)
  }

  if (asChild) {
    return (
      <Slot onClick={handleClick} {...props}>
        {children}
      </Slot>
    )
  }

  return (
    <Button
      onClick={handleClick}
      type="button"
      size="sm"
      variant="outline"
      {...props}
    >
      {children ?? <RotateCcwIcon className="size-4" />} <span>Reset</span>
    </Button>
  )
}
