import WalletButtonMenu from "./WalletButtonMenu"

import React, { useEffect, useState, useContext } from "react"
import { toHex, truncateAddress } from "../utils/utils"

import { WalletConnectedContext } from "../utils/context"

import ClientOnly from "./ClientOnly"

import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useProvider, useNetwork } from "wagmi"

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
    Spinner,
    Flex,
    Button,
    Center,
} from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

export default function WalletButton() {
    // Everything comes from Wagmi
    const provider = useProvider()
    const { address, isConnected, status } = useAccount()
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })

    const { openConnectModal } = useConnectModal()
    const { openChainModal } = useChainModal()

    let chainIcon
    let chainName
    if (chain?.id === 1) {
        chainIcon = "./EthereumLogo.svg"
        chainName = "Mainnet"
    } else if (provider._network.chainId === 5) {
        chainIcon = "./GoerliLogo.svg"
        chainName = "Goerli"
    }

    const { walletConnected, setWalletConnected } = useContext(WalletConnectedContext)

    // Check local storage for "connected" item
    // if it exists, set the state to true so the wallet
    // appears to auto-connect but doesn't if the user previously
    // manually disconnected
    useEffect(() => {
        if (window.localStorage.getItem("connected")) {
            setWalletConnected(true)
        }
    }, [isConnected])

    // Rerender when chainId changes
    const [render, rerender] = useState(false)
    useEffect(() => {
        rerender(!render)
    }, [chain?.id])

    // Rerender when wallet account (address) changes
    // I think this will only work for MetaMask
    const [currentAccount, setCurrentAccount] = useState("")
    const checkIfAccountChanged = async () => {
        try {
            const { ethereum } = window
            ethereum!.on("accountsChanged", (accounts: any) => {
                console.log("Account changed to:", accounts[0])
                setCurrentAccount(accounts[0])
                console.log("currentAccount:", currentAccount)
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        checkIfAccountChanged()
    }, [])

    // Rerender when window size changes and save
    // window size to state to allow conditional rendering
    const isSSR = typeof window === "undefined"
    const [windowSize, setWindowSize] = React.useState({
        width: isSSR ? 0 : window.innerWidth,
        height: isSSR ? 0 : window.innerHeight,
    })
    useEffect(() => {
        const handleResizeWindow = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow)
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow)
        }
    }, [])

    return (
        <Box>
            <ClientOnly>
                <Box paddingLeft={10}>
                    {isConnected && walletConnected && window.localStorage.getItem("connected") ? (
                        <>
                            <Button
                                marginRight={2}
                                paddingLeft={2}
                                paddingRight={2}
                                onClick={async () => {
                                    openChainModal ? openChainModal() : null
                                }}
                                aria-label={"Switch chain"}
                            >
                                <Image src={chainIcon}></Image>
                                {windowSize.width > 700 ? (
                                    <Text marginLeft={2}>{chainName}</Text>
                                ) : null}
                            </Button>
                            <Menu>
                                <MenuButton as={IconButton}>
                                    <Flex>
                                        <Center>
                                            {windowSize.width > 700 ? (
                                                <>
                                                    {address && ensName ? (
                                                        <Text maxWidth={200} isTruncated margin={3}>
                                                            {ensName}
                                                        </Text>
                                                    ) : null}
                                                    {address && !ensName ? (
                                                        <Text margin={3}>
                                                            {truncateAddress(address)}
                                                        </Text>
                                                    ) : null}
                                                    <Box marginRight={3}>
                                                        <FontAwesomeIcon
                                                            icon={faWallet}
                                                            size={"lg"}
                                                        />
                                                    </Box>
                                                </>
                                            ) : (
                                                <IconButton
                                                    backgroundColor={"green"}
                                                    aria-label={"Wallet button"}
                                                >
                                                    <FontAwesomeIcon icon={faWallet} size={"lg"} />
                                                </IconButton>
                                            )}
                                        </Center>
                                    </Flex>
                                </MenuButton>
                                <WalletButtonMenu />
                            </Menu>
                        </>
                    ) : (
                        <>
                            {status == "connecting" && window.localStorage.getItem("connected") ? (
                                <Button
                                    onClick={async () => {
                                        window.localStorage.removeItem("connected")
                                        disconnect()
                                        setWalletConnected(false)
                                    }}
                                >
                                    <Flex>
                                        <Center>
                                            <Text as="b">Connecting...&nbsp;</Text>
                                            <Spinner />
                                        </Center>
                                    </Flex>
                                </Button>
                            ) : (
                                <IconButton
                                    onClick={async () => {
                                        openConnectModal ? openConnectModal() : null
                                        window!.localStorage.setItem("connected", "injected")
                                    }}
                                    aria-label={"Connect wallet"}
                                >
                                    <FontAwesomeIcon icon={faWallet} size={"lg"} />
                                </IconButton>
                            )}
                        </>
                    )}
                    {/* <IconButton
                        onClick={async () => {
                            console.log("Clicked!")
                            console.log("ensAvatar:", ensAvatar)
                            console.log("ensName:", ensName)
                            console.log("width:", width)
                        }}
                        aria-label={"Test button"}
                    ></IconButton> */}
                </Box>
            </ClientOnly>
        </Box>
    )
}
