import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnboardState {
  interests: string[]
  profileImage: string | null
  isLoading: boolean
  setInterests: (interests: string[]) => void
  setProfileImage: (image: string | null) => void
  setLoading: (isLoading: boolean) => void
  clearOnboard: () => void
}

export const useOnboardStore = create<OnboardState>()(
  persist(
    (set) => ({
      interests: [],
      profileImage: null,
      isLoading: false,
      
      setInterests: (interests: string[]) => set({ interests }),
      setProfileImage: (image: string | null) => set({ profileImage: image }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      clearOnboard: () => set({ interests: [], profileImage: null, isLoading: false }),
    }),
    {
      name: 'onboard-storage',
    }
  )
)
