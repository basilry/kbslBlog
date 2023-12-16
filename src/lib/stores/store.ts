import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ICoreStore, coreStore } from "./slices/coreStore"
import { IStoreLogin, loginStore } from "./slices/loginStore"

export const useCoreStore = create<ICoreStore>()(
    persist(
        (...a) => ({
            ...coreStore(...a),
        }),
        {
            name: "core",
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
        },
    ),
)
