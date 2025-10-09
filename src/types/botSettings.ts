import { z } from "zod"

export interface ChatStylePreviewType {
  brandStyling: {
    theme: "dark" | "light"
    backgroundColor: string
    color: string
    brandLogo: string | null
  }
  chatButtonStyling: {
    backgroundColor: string
    borderColor: string
    chatButtonTextColor: string
    chatButtonIcon: string | null
    chatButtonPosition: "right" | "left"
  }
  welcomeScreenStyling: {
    welcomeScreenAppearance: "half_background" | "full_background"
    welcomeButtonBgColor: string
    welcomeButtonTextColor: string
  }
}

export interface InterfaceSettingsTypes {
  setBrandStyling: (styling: {
    theme: "dark" | "light"
    backgroundColor: string
    color: string
    brandLogo: string | null
  }) => void
  setChatButtonStyling: (styling: {
    backgroundColor: string
    borderColor: string
    chatButtonTextColor: string
    chatButtonIcon: string | null
    chatButtonPosition: "right" | "left"
  }) => void
  setWelcomeScreenStyling: (styling: {
    welcomeScreenAppearance: "half_background" | "full_background"
    welcomeButtonBgColor: string
    welcomeButtonTextColor: string
  }) => void
}

export const ContentFormSchema = z.object({
  botName: z.string().min(1, "Bot Name is required."),
  initialMessage: z.string().min(1, "Initial message is required."),
  messagePlaceholder: z.string().min(1, "Message placeholder is required."),
  dismissibleNotice: z.string().optional().nullable().default(null),
  suggestedMessagesEnabled: z.boolean().default(false),
  suggestedMessages: z.array(
    z.object({
      text: z.string()
    })
  ),
  collectUserFeedbackEnabled: z.boolean().default(false),
  regenerateMessagesEnabled: z.boolean().default(false),
  quickPromptsEnabled: z.boolean().default(false),
  quickPrompts: z.array(
    z.object({
      text: z.string()
    })
  ),
  welcomeScreenEnabled: z.boolean().default(false),
  welcomeScreen: z.object({
    title: z.string(),
    instructions: z.string()
  })
})
export type ContentForm = z.infer<typeof ContentFormSchema>

export const StyleFormSchema = z.object({
  themes: z.enum(["dark", "light"]).default("dark"),
  chatButtonIcon: z
    .instanceof(File, { message: "Please select a valid image file" })
    .refine(
      file => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Only JPG, PNG, or SVG allowed"
    )
    .optional()
    .nullable(),
  brandLogo: z
    .instanceof(File, { message: "Please select a valid image file" })
    .refine(
      file => ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Only JPG, PNG, or SVG allowed"
    )
    .optional()
    .nullable(),
  brandBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#1E50EF"),
  brandTextColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#FFFFFF"),
  chatButtonBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#F4F4F5"),
  chatButtonTextColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#71717b"),
  chatButtonBorderColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#F4F4F5"),
  chatButtonPosition: z.enum(["right", "left"]).default("right"),
  welcomeScreenAppearance: z
    .enum(["half_background", "full_background"])
    .default("half_background"),
  welcomeButtonBgColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#1E50EF"),
  welcomeButtonTextColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color")
    .default("#1E50EF")
})
export type StyleForm = z.infer<typeof StyleFormSchema>

export interface botSettingsResponse {
  botSettings: {
    brandStyling: ChatStylePreviewType["brandStyling"]
    chatButtonStyling: ChatStylePreviewType["chatButtonStyling"]
    welcomeScreenStyling: ChatStylePreviewType["welcomeScreenStyling"]
    contentPreview: ContentForm
  }
}
