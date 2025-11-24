import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardState {
  interests: string[]
  profileImage: string | null
  colorCard: number | null
  isLoading: boolean
  setInterests: (interests: string[]) => void
  setColorCard: (color_card_id: number) => void
  setProfileImage: (image: string | null) => void
  setLoading: (isLoading: boolean) => void
  clearOnboard: () => void
}

export const useOnboardStore = create<OnboardState>()(
  persist(
    (set) => ({
      interests: [],
      profileImage: null,
      colorCard: null,
      isLoading: false,
      
      setInterests: (interests: string[]) => set({ interests }),
      setColorCard: (color_card_id: number) => set({ colorCard: color_card_id }),
      setProfileImage: (image: string | null) => set({ profileImage: image }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      clearOnboard: () => set({ interests: [], profileImage: null, colorCard: null, isLoading: false }),
    }),
    {
      name: 'onboard-storage',
    }
  )
)
