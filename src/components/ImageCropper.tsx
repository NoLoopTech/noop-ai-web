import { FileInput } from "@/components/FileInput"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { IconFrame, IconFrameOff, IconRestore } from "@tabler/icons-react"
import React, { useRef, useState } from "react"

import ReactCrop, { Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Card, CardContent } from "@/components/ui/card"

interface ImageCropperProps {
  src: string
  onCancel?: () => void
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>
  setCroppedImgUrl: (url: string) => void
  setCroppedMeta: (meta: {
    name: string
    width: number
    height: number
    size: string
  }) => void
  variant?: "freeform" | "square" | "circular"
  setCropApplied: (applied: boolean) => void
  accept?: string
  icon?: React.ReactNode
  onFileChange?: (file: File | null) => void
  croppedImgUrl?: string
  croppedMeta?: {
    name: string
    width: number
    height: number
    size: string
  } | null
  croppingDone?: boolean
  setImgSrc: (src: string) => void
  popoverTriggerText?: string
}

export default function ImageCropper({
  src,
  onCancel,
  previewCanvasRef,
  setCroppedImgUrl,
  setCroppedMeta,
  setCropApplied,
  variant = "freeform",
  accept,
  icon,
  onFileChange,
  croppedImgUrl,
  croppedMeta,
  croppingDone,
  setImgSrc,
  popoverTriggerText
}: ImageCropperProps) {
  const DEFAULT_CROP: Crop = { unit: "%", width: 30, aspect: 16 / 9 }

  const [crop, setCrop] = useState<Crop>(DEFAULT_CROP)
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  function handleCropChange(c: Crop) {
    setCrop(c)
  }

  function getCenteredCrop(
    imgWidth: number,
    imgHeight: number,
    aspect?: number
  ): Crop {
    const cropWidth = aspect
      ? Math.min(imgWidth * 0.8, imgHeight * 0.8 * aspect)
      : imgWidth * 0.8
    const cropHeight = aspect ? cropWidth / aspect : imgHeight * 0.8
    const x = (imgWidth - cropWidth) / 2
    const y = (imgHeight - cropHeight) / 2
    return {
      unit: "px",
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
      x: Math.round(x),
      y: Math.round(y),
      aspect: aspect
    }
  }

  function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    imgRef.current = e.currentTarget as HTMLImageElement
    const img = imgRef.current
    if (!img) return
    let newCrop: Crop
    if (variant === "square" || variant === "circular") {
      newCrop = getCenteredCrop(img.width, img.height, 1)
    } else {
      newCrop = getCenteredCrop(img.width, img.height, undefined)
    }
    setCrop(newCrop)
    onCropChange(newCrop)
  }

  function onCropChange(crop: Crop) {
    setCompletedCrop(crop)
    if (
      imgRef.current &&
      previewCanvasRef.current &&
      crop.width &&
      crop.height
    ) {
      const image = imgRef.current
      const canvas = previewCanvasRef.current
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const width = Math.round((crop.width ?? 1) * 5)
      const height = Math.round((crop.height ?? 1) * 5)
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (variant === "circular") {
        ctx.save()
        ctx.beginPath()
        const radius = Math.min(canvas.width, canvas.height) / 2
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(
          image,
          (crop.x ?? 0) * scaleX,
          (crop.y ?? 0) * scaleY,
          (crop.width ?? 1) * scaleX,
          (crop.height ?? 1) * scaleY,
          0,
          0,
          width,
          height
        )
        ctx.restore()
      } else {
        ctx.drawImage(
          image,
          (crop.x ?? 0) * scaleX,
          (crop.y ?? 0) * scaleY,
          (crop.width ?? 1) * scaleX,
          (crop.height ?? 1) * scaleY,
          0,
          0,
          width,
          height
        )
      }
    }
  }

  function handleApply() {
    if (completedCrop && imgRef.current) {
      const image = imgRef.current
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      const crop = completedCrop
      const width = (crop.width ?? 1) * 5
      const height = (crop.height ?? 1) * 5
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (variant === "circular") {
        ctx.save()
        ctx.beginPath()
        const radius = Math.min(canvas.width, canvas.height) / 2
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(
          image,
          (crop.x ?? 0) * scaleX,
          (crop.y ?? 0) * scaleY,
          (crop.width ?? 1) * scaleX,
          (crop.height ?? 1) * scaleY,
          0,
          0,
          width,
          height
        )
        ctx.restore()
      } else {
        ctx.drawImage(
          image,
          (crop.x ?? 0) * scaleX,
          (crop.y ?? 0) * scaleY,
          (crop.width ?? 1) * scaleX,
          (crop.height ?? 1) * scaleY,
          0,
          0,
          width,
          height
        )
      }
      const url = canvas.toDataURL("image/png", 1.0)
      setCroppedImgUrl(url)
      const uuid = Math.random().toString(16).slice(2, 10).padEnd(8, "0")
      const timestamp = Date.now()
      const sizeBytes = Math.round(
        ((url.length - "data:image/png;base64,".length) * 3) / 4
      )
      const sizeKB = (sizeBytes / 1024).toFixed(2)
      setCroppedMeta({
        name: `${uuid}-${timestamp}.png`,
        width: Math.round(width),
        height: Math.round(height),
        size: sizeKB
      })

      setCropApplied(true)
      setPopoverOpen(false)
      setImgSrc("")
      if (onFileChange) {
        onFileChange(null)
      }
    }
  }

  function handleReset() {
    if (imgRef.current) {
      const img = imgRef.current
      let newCrop: Crop
      if (variant === "square" || variant === "circular") {
        newCrop = getCenteredCrop(img.width, img.height, 1)
      } else {
        newCrop = getCenteredCrop(img.width, img.height, undefined)
      }
      setCrop(newCrop)
      onCropChange(newCrop)
      setCroppedImgUrl("")
      setCroppedMeta({ name: "", width: 0, height: 0, size: "" })
      setCropApplied(false)
    } else {
      setCrop(DEFAULT_CROP)
      onCropChange(DEFAULT_CROP)
    }
  }

  /**
   * NOTE: There is a issue in Chrome where cancelling the cropping process
   * may prevent the cropping UI from restarting properly if the same image is used.
   * This does not occur in Firefox. The root cause is likely related to how
   * Chrome handles component remounts and refs with react-image-crop.
   */
  function handleCancel() {
    setCrop(DEFAULT_CROP)
    setCompletedCrop(null)
    if (typeof onCancel === "function") {
      onCancel()
    }

    if (onFileChange) {
      onFileChange(null)
    }

    setPopoverOpen(false)
  }

  function handleFileInputChange(file: File | null) {
    if (onFileChange) {
      onFileChange(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger className="self-end" asChild>
          <Button variant="outline">{popoverTriggerText}</Button>
        </PopoverTrigger>
        <PopoverContent className="mt-2 flex w-72 flex-col items-center space-y-5 p-4">
          <FileInput
            accept={accept}
            icon={icon}
            onChange={handleFileInputChange}
          />

          {src && (
            <>
              <ReactCrop
                crop={crop}
                onChange={handleCropChange}
                onComplete={onCropChange}
                aspect={
                  variant === "square" || variant === "circular" ? 1 : undefined
                }
                circularCrop={variant === "circular"}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={src}
                  alt="Source"
                  onLoad={handleImageLoad}
                  className="w-40"
                />
              </ReactCrop>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={"secondary"}
                  className="flex h-max w-max items-center px-2.5 py-1 font-normal"
                  onClick={handleApply}
                >
                  <IconFrame className="h-4 w-4" />
                  Apply
                </Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  className="flex h-max w-max items-center px-2.5 py-1 font-normal"
                  onClick={handleReset}
                >
                  <IconRestore className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  className="flex h-max w-max items-center px-2.5 py-1 font-normal"
                  onClick={handleCancel}
                >
                  <IconFrameOff className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      {croppingDone && croppedImgUrl && croppedMeta && (
        <div className="flex items-center space-x-3">
          {croppedMeta && (
            <div className="self-start text-right text-sm text-gray-700">
              <p>{croppedMeta.name}</p>
              <p>{croppedMeta.size} KB</p>
            </div>
          )}

          <Card
            className={`${
              variant === "circular" ? "rounded-full" : "rounded-md"
            }`}
          >
            <CardContent className={`h-max w-max overflow-hidden p-1`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={croppedImgUrl}
                alt="Cropped"
                className={`max-w-40 ${
                  variant === "circular" ? "rounded-full" : "rounded-md"
                }`}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
