"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useOnboardStore } from "@/store/onboardStore";
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

  return useMutation<{ message: string }, ApiError, { color_card: number }>({
    mutationFn: async (data: { color_card: number }) => {
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
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

// General Onboarding Functions (Placeholder)
// export function useOnboardingGeneral() {
//   const { setLoading } = useOnboardStore();

//   return useMutation<{ message: string }, ApiError, any>({
//     mutationFn: async (data: any) => {
//       setLoading(true);
//       // Placeholder endpoint
//       const response = await api.post<{ message: string }>(
//         "/onboarding/general",
//         data
//       );
//       return response.data;
//     },
//     onSettled: () => {
//       setLoading(false);
//     },
//   });
// }
