"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useOnboardStore } from "@/store/onboardStore";

export function DataHydrator() {
  const { setUserData } = useUserStore();
  const { setOnboardingStep, setInterests, setProfileImage, setColorCard } = useOnboardStore();


  useEffect(() => {
    // Read user data from cookie
    const userDataCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user_data='));
    
    if (userDataCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
        
        // Update Zustand stores
        setUserData(userData);
        console.log("Hydrated user data from cookie:", userData);

        // Update onboarding store
        if (userData.pfp_url) {
          setProfileImage(userData.pfp_url);
        }
        if (userData.interests && userData.interests.length > 0) {
          setInterests(userData.interests);
        }
        if (userData.color_card_id) {
          setColorCard(userData.color_card_id);
        }

        // Set onboarding step
        let step = 1;
        if (userData.pfp_url) step = 2;
        if (userData.interests && userData.interests.length > 0) step = 3;
        if (userData.color_card_id) step = 4;
        setOnboardingStep(step);
        
      } catch (error) {
        console.error("Error parsing user data cookie:", error);
      }
    }
  }, []);

  return null;
}