import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  dob: string;
  description: string;
  name: string;
  user_name: string;
  pfp_url: string;
  color_card_id: string;
  interests: string[] | null;
  email: string;
  phone: string;
  onboarding_step: number;
}

interface UserState {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null,
      
      setUserData: (userData: UserData) => set({ userData }),
      
      clearUserData: () => set({ userData: null }),
    }),
    {
      name: 'user-storage',
    }
  )
)
