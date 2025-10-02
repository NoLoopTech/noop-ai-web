export interface ChatStylePreviewType {
  brandStyling: {
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
