// Example from https://codesandbox.io/s/brave-lamport-t5t6l

import { createContext } from "react"

type ThemeContextType = {
    theme: string
    setTheme: React.Dispatch<React.SetStateAction<string>>
}
const ThemeContext = createContext<ThemeContextType>({
    theme: "",
    setTheme: () => {},
})

type WalletContextType = {
    walletConnected: boolean
    setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>
}
const WalletConnectedContext = createContext<WalletContextType>({
    walletConnected: false,
    setWalletConnected: () => {},
})

export { ThemeContext, WalletConnectedContext }
