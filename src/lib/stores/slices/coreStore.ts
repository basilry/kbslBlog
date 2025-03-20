import { StateCreator } from "zustand"

export const coreStore: StateCreator<ICoreStore> = (set) => ({
    darkMode: true,
    sideBarFold: false,
    nowMenuName: "",
    changeDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    changeSideBarFold: (params) => set(() => ({ sideBarFold: params })),
    changeNowMenuName: (params: string) => set(() => ({ nowMenuName: params })),
})

export interface ICoreStore {
    darkMode: boolean
    sideBarFold: boolean
    nowMenuName: string
    changeDarkMode: () => void
    changeSideBarFold: (params: boolean) => void
    changeNowMenuName: (params: string) => void
}
