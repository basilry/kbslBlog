import { StateCreator } from "zustand"

export const coreStore: StateCreator<ICoreStore> = (set) => ({
    darkMode: true,
    nowMenuName: "",
    changeDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    changeNowMenuName: (params: string) => set(() => ({ nowMenuName: params })),
})

export interface ICoreStore {
    darkMode: boolean
    nowMenuName: string
    changeDarkMode: () => void
    changeNowMenuName: (params: string) => void
}
