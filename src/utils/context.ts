// Example from https://codesandbox.io/s/brave-lamport-t5t6l

import { createContext } from "react"

// Set Theme Context
type ThemeContextType = {
    theme: string
    setTheme: React.Dispatch<React.SetStateAction<string>>
}
const ThemeContext = createContext<ThemeContextType>({
    theme: "",
    setTheme: () => {},
})

// Set Wallet Connected Context
type WalletContextType = {
    walletConnected: boolean
    setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>
}
const WalletConnectedContext = createContext<WalletContextType>({
    walletConnected: false,
    setWalletConnected: () => {},
})

// Set Custom RPC Provider Context
type CustomRpcProviderContextContextType = {
    customRpcProvider: boolean
    setCustomRpcProvider: React.Dispatch<React.SetStateAction<string>>
}
const CustomRpcProviderContext = createContext<CustomRpcProviderContextContextType>({
    customRpcProvider: false,
    setCustomRpcProvider: () => {},
})

export { ThemeContext, WalletConnectedContext, CustomRpcProviderContext }
