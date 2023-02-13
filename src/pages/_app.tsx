import type { AppProps } from "next/app"
import { useState, useEffect } from "react"
import "../styles/globals.css"

import { ThemeContext, WalletConnectedContext } from "../utils/context"

import { ChakraProvider } from "@chakra-ui/react"
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from "wagmi"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"

import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from "@rainbow-me/rainbowkit"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
    // Use this theme variable, which is set at the same time as
    // the Chakra theme variable (in ColorModeToggle.tsx) to set
    // the Rainbow theme and any other theme variables in the future
    const [theme, setTheme] = useState("darkTheme")

    // Assume wallet is not connected by default
    // then check local storage for "connected" item and if it
    // exists, the state is set to true (in WalletButton.tsx)
    const [walletConnected, setWalletConnected] = useState(false)

    // Create Wagmi client
    const { chains, provider } = configureChains(
        [mainnet, goerli],
        [
            // TODO: Doesn't work with basic auth in the RPC URL
            // https://github.com/wagmi-dev/wagmi/discussions/1847
            // *** Uncomment to use your own RPC URLs ***
            // jsonRpcProvider({
            //     priority: 0,
            //     rpc: (chain) => ({
            //         http:
            //             chain.id === 1
            //                 ? process.env.NEXT_PUBLIC_MAINNET_RPC_URL
            //                 : process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
            //     }),
            // }),
            publicProvider(),
        ]
    )
    const { connectors } = getDefaultWallets({
        appName: "NFT Image Locator App",
        chains,
    })
    const wagmiClient = createClient({
        autoConnect: walletConnected,
        connectors,
        provider,
    })

    // This is a hack to get the wallet to auto-connect
    // but only when the user has previously connected
    // and not manually disconnected
    const [render, rerender] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            if (window.localStorage.getItem("connected")) {
                rerender(!render)
            }
        }, 500)
    }, [walletConnected])

    return (
        <ChakraProvider>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <WalletConnectedContext.Provider value={{ walletConnected, setWalletConnected }}>
                    <WagmiConfig client={wagmiClient}>
                        <RainbowKitProvider
                            theme={theme == "darkTheme" ? darkTheme() : lightTheme()}
                            chains={chains}
                        >
                            <Component {...pageProps} />
                        </RainbowKitProvider>
                    </WagmiConfig>
                </WalletConnectedContext.Provider>
            </ThemeContext.Provider>
        </ChakraProvider>
    )
}

export default MyApp
