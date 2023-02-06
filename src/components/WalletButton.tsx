import { useMoralis } from "react-moralis"
import { useEffect } from "react"

import { Box, IconButton, Text } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

export default function ManualHeader() {
    // useMoralis is a React "hook" that hooks into the React state and lifecycle features
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    // No dependency array:
    //   run anytime something re-renders
    //   CAREFUL with this!! Because then you can get circular render
    // Blank dependency array:
    //   run once on load / rerender
    //   dependencies in the array, run anytime something in there changes

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <Box>
            {account ? (
                <Box paddingLeft={10}>
                    <IconButton aria-label={"Wallet connected"}>
                        <Text margin={3}>
                            {account.slice(0, 4)}...{account.slice(account.length - 4)}
                        </Text>
                    </IconButton>
                </Box>
            ) : (
                <Box paddingLeft={10}>
                    <IconButton
                        onClick={async () => {
                            await enableWeb3()
                            if (typeof window !== "undefined") {
                                window.localStorage.setItem("connected", "injected")
                            }
                        }}
                        disabled={isWeb3EnableLoading}
                        aria-label={"Connect wallet"}
                    >
                        <FontAwesomeIcon icon={faWallet} size={"lg"} />
                    </IconButton>
                </Box>
            )}
        </Box>
    )
}
