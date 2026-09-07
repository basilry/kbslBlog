import { create } from "zustand"
import { persist } from "zustand/middleware"
import { IStoreLogin, loginStore } from "@lib/stores/slices/loginStore"
import { coreStore, ICoreStore } from "./slices/coreStore"

export const useCoreStore = create<ICoreStore>()(
    persist(
        (...a) => ({
            ...coreStore(...a),
        }),
        {
            name: "core",
            skipHydration: true,
            partialize: (state) => ({ darkMode: state.darkMode }),
        },
    ),
)

export const useLoginStore = create<IStoreLogin>()(
    persist(
        (...a) => ({
            ...loginStore(...a),
        }),
        {
            name: "login",
            skipHydration: true,
        },
    ),
)
