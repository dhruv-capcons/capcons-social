import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardState {
  interests: string[]
  profileImage: string | null
  colorCard: string | null
  onboardingStep: number
  isLoading: boolean
  setInterests: (interests: string[]) => void
  setColorCard: (color_card_id: string) => void
  setProfileImage: (image: string | null) => void
  setOnboardingStep: (step: number) => void
  setLoading: (isLoading: boolean) => void
  clearOnboard: () => void
}

export const useOnboardStore = create<OnboardState>()(
  persist(
    (set) => ({
      interests: [],
      profileImage: null,
      colorCard: null,
      onboardingStep: 1,
      isLoading: false,
      
      setInterests: (interests: string[]) => set({ interests }),
      setColorCard: (color_card_id: string) => set({ colorCard: color_card_id }),
      setProfileImage: (image: string | null) => set({ profileImage: image }),
      setOnboardingStep: (step: number) => set({ onboardingStep: step }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      clearOnboard: () => set({ interests: [], profileImage: null, colorCard: null, onboardingStep: 1, isLoading: false }),
    }),
    {
      name: 'onboard-storage',
    }
  )
)
