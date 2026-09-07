import { create } from "zustand"

interface NavigationState {
    isOpen: boolean
    setOpen: (isOpen: boolean) => void
}

// Transient navigation must not notify theme/content subscribers or write localStorage.
export const useNavigationStore = create<NavigationState>((set) => ({
    isOpen: false,
    setOpen: (isOpen) => set((state) => state.isOpen === isOpen ? state : { isOpen }),
}))
