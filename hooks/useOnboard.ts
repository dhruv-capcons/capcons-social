"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useOnboardStore } from "@/store/onboardStore";
import api from "@/lib/axios";
import { ApiError } from "@/types/auth";
import axios from "axios";

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

// Get Interests List Query
export function useGetInterests({
  page,
  length,
  search,
}: {
  page: number;
  length: number;
  search?: string;
}) {
  return useQuery<Interest[], ApiError>({
    queryKey: ["interests-list"],
    queryFn: async () => {
      const { data } = await api.get<{ interests: Interest[] }>(
        `/utils/interests?page=${page}&length=${length}${
          search ? `&search=${search}` : ""
        }`
      );
      return data?.interests;
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
      const response = await api.post<{ message: string }>(
        "/onboarding/interests",
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
