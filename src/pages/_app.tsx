import type { AppProps } from "next/app"
import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi"

import { connectors } from "../utils/connectors"
import { providers } from "ethers"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

import { publicProvider } from "wagmi/providers/public"

const { provider, webSocketProvider } = configureChains([mainnet], [publicProvider()])

const client = createClient({
    provider,
    webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <WagmiConfig client={client}>
                <Component {...pageProps} />
            </WagmiConfig>
        </ChakraProvider>
    )
}

export default MyApp
