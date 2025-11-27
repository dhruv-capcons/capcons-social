"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useOnboardStore } from "@/store/onboardStore";
import { useUserStore } from "@/store/userStore";
import api from "@/lib/axios";
import { ApiError } from "@/types/auth";



// Types
export interface UpdateInterestsData {
  interests: string[];
}

export interface UpdateProfilePicData {
  profile_image: File;
}

export interface Interest {
  _id: string;
  name: string;
  slug: string;
  parent_slug: string;
  type: string;
}

export interface InterestsByCategory {
  [categoryName: string]: Interest[];
}

// Get Interests List Query - fetches interests for multiple parent slugs
export function useGetInterests({
  page,
  length,
  parent_slugs,
}: {
  page: number;
  length: number;
  parent_slugs?: string[];
}) {
  return useQuery<InterestsByCategory, ApiError>({
    queryKey: ["interests-list", parent_slugs],
    queryFn: async () => {
      if (!parent_slugs || parent_slugs.length === 0) {
        // If no parent slugs, fetch all interests
        const { data } = await api.get<{ interests: Interest[] }>(
          `/utils/interests?page=${page}&length=${length}`
        );
        return { all: data?.interests || [] };
      }

      // Fetch interests for each parent slug
      const promises = parent_slugs.map((slug) =>
        api.get<{ interests: Interest[] }>(
          `/utils/interests?page=${page}&length=${length}&parent_slug=${slug}`
        )
      );

      const results = await Promise.all(promises);

      // Combine results into object with slug as key
      const combined: InterestsByCategory = {};
      results.forEach((result, index) => {
        const slug = parent_slugs[index];
        combined[slug] = result.data?.interests || [];
      });

      return combined;
    },
    staleTime: Infinity,
  });
}

// Update Interests Mutation
export function useUpdateInterests() {
  const { setInterests, setLoading } = useOnboardStore();

  return useMutation<{ message: string }, ApiError, UpdateInterestsData>({
    mutationFn: async (data: UpdateInterestsData) => {
      setLoading(true);
      const response = await api.patch<{ message: string }>(
        "/users/profile/interest",
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      setInterests(variables.interests);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Update Profile Picture Mutation
export function useUpdateProfilePic() {
  const { setProfileImage, setLoading } = useOnboardStore();

  return useMutation<
    { success: boolean; image_url: string },
    ApiError,
    UpdateProfilePicData
  >({
    mutationFn: async (data: UpdateProfilePicData) => {
      const formData = new FormData();
      formData.append("profile_image", data.profile_image);

      const response = await fetch("/api/onboard/pfp", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      return response.json();
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      if (data.image_url) {
        setProfileImage(data.image_url);
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export function useUpdateColorCard() {
  const { setColorCard, setLoading } = useOnboardStore();
  const { setUserData } = useUserStore();

  return useMutation<{ message: string }, ApiError, { color_card: string }>({
    mutationFn: async (data: { color_card: string }) => {
      setLoading(true);
      const payload = { color_card_id: data.color_card };
      const response = await api.patch<{ message: string }>(
        "/users/profile/colorcard",
        payload
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      setColorCard(variables.color_card);

      // Extract user data from cookie
      const userDataCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_data='));
      
      if (userDataCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userDataCookie.split('=')[1]));
          setUserData(userData);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// Update User Profile (Username, DOB, Description)
export interface useOnboardingGeneralData {
  username: string;
  dob: string;
  description: string;
}

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

export function useOnboardingGeneral() {
  const { setLoading } = useOnboardStore();
  const { setUserData } = useUserStore();
 

  return useMutation<{ data: UserData }, ApiError, useOnboardingGeneralData>({
    mutationFn: async (data: useOnboardingGeneralData) => {
      setLoading(true);
      
      const response = await fetch('/api/onboard/user-details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || json.message || 'Failed to update profile');
      }

      return json;
    },
    onSuccess: (response) => {
      if (response.data) {
        setUserData(response.data);
      }
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}
