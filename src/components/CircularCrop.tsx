"use client"

import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset
} from "./ImageCrop"
import { FileInput } from "./FileInput"
import { IconUpload } from "@tabler/icons-react"
import { Card, CardContent } from "./ui/card"

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface CircularCropProps {
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: string
  icon?: React.ReactNode
  variant?:
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | "link"
  label?: string
  display?: "icon" | "text" | "icon-text"
  filename?: string
  outputSize?: number
  cropShape?: "circle" | "square"
}

const CircularCrop = ({
  value,
  onChange,
  accept = "image/jpeg,image/png,image/svg+xml",
  icon = <IconUpload className="h-4 w-4" />,
  variant = "outline",
  label = "Upload",
  display = "icon-text",
  outputSize = 500,
  cropShape = "circle"
}: CircularCropProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(value || null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)

  const generateShortUUID = (): string => {
    return Math.random().toString(36).substring(2, 10)
  }

  useEffect(() => {
    setSelectedFile(value || null)
  }, [value])

  const handleFileInputChange = (file: File | null): void => {
    if (file) {
      setSelectedFile(file)
      setCroppedImage(null)

      onChange?.(file)
    }
  }

  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",")
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const getFileExtension = (file: File | null, mimeType?: string): string => {
    if (file?.name) {
      const extension = file.name.split(".").pop()?.toLowerCase()
      if (extension) return extension
    }

    if (mimeType) {
      switch (mimeType) {
        case "image/jpeg":
          return "jpg"
        case "image/png":
          return "png"
        case "image/svg+xml":
          return "svg"
        case "image/webp":
          return "webp"
        default:
          return "jpg"
      }
    }

    return "jpg"
  }

  const handleCropComplete = (croppedImageUrl: string): void => {
    setCroppedImage(croppedImageUrl)

    const uuid = generateShortUUID()

    const timestamp = Date.now()

    const arr = croppedImageUrl.split(",")
    const mimeType = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg"
    const extension = getFileExtension(selectedFile, mimeType)

    const customFilename = `${uuid}-${timestamp}.${extension}`

    const croppedFileResult = base64ToFile(croppedImageUrl, customFilename)

    onChange?.(croppedFileResult)
  }

  const handleCropChange = (crop: CropArea): void => {
    // INFO: Handle crop area changes while user is adjusting the selection
    // eslint-disable-next-line no-console
    console.log("Crop area changed:", crop)

    // INFO: Validate crop area to ensure it's square for circular crop
    if (crop.width && crop.height) {
      const aspectRatio = crop.width / crop.height
      if (Math.abs(aspectRatio - 1) > 0.1) {
        // INFO: Warn if not close to square (for circular crop)
        // eslint-disable-next-line no-console
        console.warn("Crop should be square for circular result")
      }
    }
  }

  const onCropComplete = (croppedAreaPixels: CropArea): void => {
    if (croppedAreaPixels) {
      const { width, height, x, y } = croppedAreaPixels

      if (width < 50 || height < 50) {
        // INFO: Warn if crop area is too small
        // eslint-disable-next-line no-console
        console.warn("Crop area too small")
        return
      }

      if (width < 100 || height < 100) {
        // INFO: Validate minimum size for good quality
        // eslint-disable-next-line no-console
        console.warn(
          "Crop area should be at least 100x100 pixels for good quality"
        )
      }

      // INFO: Log crop completion
      // eslint-disable-next-line no-console
      console.log("Crop completed with dimensions:", {
        width,
        height,
        x,
        y
      })
    }
  }

  const handleReset = (): void => {
    setSelectedFile(null)
    setCroppedImage(null)
    onChange?.(null)
  }

  if (!selectedFile) {
    return (
      <FileInput
        value={null}
        onChange={handleFileInputChange}
        accept={accept}
        multiple={false}
        icon={icon}
        variant={variant}
        label={label}
        display={display}
      />
    )
  }

  if (croppedImage) {
    return (
      <div className="flex items-center space-x-4">
        <Card
          className={`flex items-center justify-center p-0 ${cropShape === "circle" ? "rounded-full" : "rounded-xl"}`}
        >
          <CardContent className="p-1">
            <Image
              alt="Cropped picture"
              className={`overflow-hidden ${cropShape === "circle" ? "rounded-full" : "rounded-lg"}`}
              height={72}
              src={croppedImage}
              unoptimized
              width={72}
            />
          </CardContent>
        </Card>
        <div className="flex flex-col items-start space-y-1">
          <Button
            onClick={handleReset}
            size="sm"
            type="button"
            variant="outline"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Remove
          </Button>
          {selectedFile && (
            <div className="text-muted-foreground flex flex-col items-start space-y-1 text-sm">
              <p>{selectedFile.name}</p>
              <p>
                {selectedFile.size
                  ? ` (${(selectedFile.size / 1024).toFixed(2)} KB)`
                  : ""}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ImageCrop
        aspect={1}
        circularCrop={cropShape === "circle" ? true : false}
        file={selectedFile}
        onChange={handleCropChange}
        onComplete={onCropComplete}
        onCrop={handleCropComplete}
        outputSize={outputSize}
      >
        <ImageCropContent className="max-w-md" />
        <div className="flex items-center gap-2">
          <ImageCropApply />
          <ImageCropReset />
          <Button
            onClick={handleReset}
            size="sm"
            type="button"
            variant="outline"
          >
            <XIcon className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      </ImageCrop>
    </div>
  )
}

export default CircularCrop
