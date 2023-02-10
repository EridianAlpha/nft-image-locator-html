import React, { useEffect, useState, useContext } from "react"
import { toHex, truncateAddress } from "../utils/utils"

import { WalletConnectedContext } from "../utils/context"

import ClientOnly from "./ClientOnly"

import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useProvider } from "wagmi"

import "@rainbow-me/rainbowkit/styles.css"
import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit"

import {
    Box,
    IconButton,
    Text,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    Image,
} from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

export default function WalletButton() {
    const [error, setError] = useState<any>("")

    // Everything comes from Wagmi
    const { address, isConnected, status } = useAccount()

    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })
    const provider = useProvider()

    const { openConnectModal } = useConnectModal()
    const { openChainModal } = useChainModal()

    let chainIcon
    if (provider._network.chainId === 1) {
        chainIcon = "./EthereumLogo.svg"
    } else if (provider._network.chainId === 5) {
        chainIcon = "./GoerliLogo.svg"
    }

    const { disconnect } = useDisconnect()
    const { walletConnected, setWalletConnected } = useContext(WalletConnectedContext)

    // Check local storage for "connected" item
    // if it exists, set the state to true so the wallet
    // appears to auto-connect but doesn't if the user previously
    // manually disconnected
    useEffect(() => {
        if (window.localStorage.getItem("connected")) {
            setWalletConnected(true)
        }
    }, [])

    // Keep rerendering the page until the wallet is connected
    // This isn't a great solution but it works
    const [render, rerender] = useState(false)
    const [trigger, setTrigger] = useState(true)

    useEffect(() => {
        if (trigger && !isConnected && status != "disconnected") {
            rerender(!render)
        }
        if (trigger && isConnected) {
            setTrigger(false)
        }
    })

    return (
        <Box>
            <ClientOnly>
                {isConnected && window.localStorage.getItem("connected") ? (
                    <Box paddingLeft={10}>
                        <IconButton
                            marginRight={2}
                            onClick={async () => {
                                openChainModal ? openChainModal() : null
                            }}
                            aria-label={"Switch chain"}
                        >
                            <Image src={chainIcon}></Image>
                        </IconButton>
                        <Menu>
                            <MenuButton as={IconButton}>
                                {address ? (
                                    <Text margin={3}>{truncateAddress(address)}</Text>
                                ) : null}
                            </MenuButton>
                            <MenuList>
                                <MenuItem
                                    onClick={async () => {
                                        window.localStorage.removeItem("connected")
                                        disconnect()
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
                                openConnectModal ? openConnectModal() : null
                                window!.localStorage.setItem("connected", "injected")
                            }}
                            aria-label={"Connect wallet"}
                        >
                            <FontAwesomeIcon icon={faWallet} size={"lg"} />
                        </IconButton>
                    </Box>
                )}
            </ClientOnly>
        </Box>
    )
}
