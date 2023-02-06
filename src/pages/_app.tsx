import type { AppProps } from "next/app"
import "../styles/globals.css"
import { ChakraProvider } from "@chakra-ui/react"

import { MoralisProvider } from "react-moralis"

import { config } from "@fortawesome/fontawesome-svg-core"
import "@fortawesome/fontawesome-svg-core/styles.css"
config.autoAddCss = false

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </MoralisProvider>
    )
}

export default MyApp
