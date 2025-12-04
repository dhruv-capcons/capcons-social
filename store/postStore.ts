import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ModalType = "create" | "drafts" | "upload" | "schedule" | "crop" ;

interface PostState {
  modalType: ModalType;
  setModalType: (modalType: ModalType) => void
}

export const usePostStore = create<PostState>()(
  persist(
    (set) => ({
      modalType: "create",
      setModalType: (modalType: ModalType) => set({ modalType }),          
    }),
    {
      name: 'post-storage',
    }
  )
)
