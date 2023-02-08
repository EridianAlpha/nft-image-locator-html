import type { AppProps } from "next/app"
import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { WagmiConfig, createClient, configureChains, mainnet, goerli } from "wagmi"
import { publicProvider } from "wagmi/providers/public"

import {
    getDefaultWallets,
    RainbowKitProvider,
    darkTheme,
    lightTheme,
} from "@rainbow-me/rainbowkit"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

const { chains, provider } = configureChains([mainnet, goerli], [publicProvider()])

const { connectors } = getDefaultWallets({
    appName: "NFT Image Locator App",
    chains,
})

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider theme={darkTheme()} chains={chains}>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </WagmiConfig>
        </ChakraProvider>
    )
}

export default MyApp
