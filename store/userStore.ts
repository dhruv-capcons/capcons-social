import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserData {
  _id: string;
  name: string;
  user_name: string;
  dob: string;
  gender: string;
  description: string;
  pfp_url: string;
  interests?: string[];
  color_card_id: string;
  onboarding_step: number;
  email: string;
  phone: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  country_code: string;
  registration_date: string;
}

interface UserState {
  userData: UserData | null;
  setUserData: (userData: UserData) => void;
  clearUserData: () => void;
  hydrateFromCookie: () => void; // New method to hydrate from cookie
  isHydrated: boolean; // Track if data is loaded from cookie
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userData: null,
      isHydrated: false,
      
      setUserData: (userData: UserData) => set({ userData }),
      
      clearUserData: () => set({ userData: null, isHydrated: false }),
      
      hydrateFromCookie: () => {
        // Only hydrate on client-side
        if (typeof window === 'undefined') return;
        
        try {
          // Read from user_data cookie set by middleware
          const userDataCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('user_data='));
          
          if (userDataCookie) {
            const cookieValue = decodeURIComponent(userDataCookie.split('=')[1]);
            const parsedData = JSON.parse(cookieValue);
            
            // Transform the data to match UserData interface
            const userData: UserData = {
              _id: parsedData._id || '',
              name: parsedData.name || '',
              user_name: parsedData.user_name || parsedData.userslug || '',
              dob: parsedData.dob || '',
              gender: parsedData.gender || '',
              description: parsedData.description || '',
              pfp_url: parsedData.pfp_url || '',
              interests: parsedData.interests || [],
              color_card_id: parsedData.color_card_id || '',
              onboarding_step: parsedData.onboarding_step || 1,
              email: parsedData.email || '',
              phone: parsedData.phone || '',
              is_email_verified: parsedData.is_email_verified || false,
              is_phone_verified: parsedData.is_phone_verified || false,
              country_code: parsedData.country_code || '',
              registration_date: parsedData.registration_date || '',
            };
            
            // Only update if data is different (prevents unnecessary re-renders)
            const currentData = get().userData;
            if (JSON.stringify(currentData) !== JSON.stringify(userData)) {
              set({ userData, isHydrated: true });
            }
          }
        } catch (error) {
          console.error('Error hydrating user data from cookie:', error);
          set({ isHydrated: true }); // Mark as hydrated even if error
        }
      },
    }),
    {
      name: 'user-storage',
      // Optional: You can skip persist if you're using cookies from middleware
      // Or use persist as fallback
    }
  )
)

// Helper hook to automatically hydrate on mount
export const useUserDataHydration = () => {
  const hydrateFromCookie = useUserStore((state) => state.hydrateFromCookie);
  
  // Hydrate on component mount (client-side only)
  if (typeof window !== 'undefined') {
    hydrateFromCookie();
  }
};