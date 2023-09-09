import { create } from "zustand"
import { persist } from "zustand/middleware"
import { IStoreLogin, loginStore } from "../stores/loginStore"

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
