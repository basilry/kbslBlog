import { StateCreator } from "zustand"

export const coreStore: StateCreator<ICoreStore> = (set) => ({
    darkMode: false,
    sideBarFold: false,
    changeDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    changeSideBarFold: (params) => set(() => ({ sideBarFold: params })),
})

export interface ICoreStore {
    darkMode: boolean
    sideBarFold: boolean
    changeDarkMode: () => void
    changeSideBarFold: (params: boolean) => void
}
