import { useMoralis } from "react-moralis"
import { useEffect } from "react"

import { Box, IconButton, Text, MenuButton, MenuList, MenuItem, Menu } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    // Check if the user has already connected to a wallet
    useEffect(() => {
        if (isWeb3Enabled) return
        if (window!.localStorage.getItem("connected")) {
            enableWeb3()
        }
    }, [isWeb3Enabled])

    // When the MetaMask account changes, update the state
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            // if (!isWeb3Enabled) return
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
                    <Menu>
                        <MenuButton as={IconButton}>
                            <Text margin={3}>
                                {account.slice(0, 4)}...{account.slice(account.length - 4)}
                            </Text>
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                onClick={async () => {
                                    window.localStorage.removeItem("connected")
                                    await deactivateWeb3()
                                }}
                            >
                                Disconnect
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            ) : (
                <Box paddingLeft={10}>
                    <IconButton
                        onClick={async () => {
                            await enableWeb3()
                            window!.localStorage.setItem("connected", "injected")
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
