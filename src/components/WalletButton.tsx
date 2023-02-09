import { useEffect, useState } from "react"
import { toHex, truncateAddress } from "../../utils"
import { ethers } from "ethers"

import ClientOnly from "./ClientOnly"

import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi"

import "@rainbow-me/rainbowkit/styles.css"
import { useConnectModal, useAccountModal, useChainModal } from "@rainbow-me/rainbowkit"

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
import { faWallet, faChain } from "@fortawesome/free-solid-svg-icons"

export default function WalletButton() {
    const [provider, setProvider] = useState<any>()
    const [library, setLibrary] = useState<any>()
    const [account, setAccount] = useState<string>()
    const [signature, setSignature] = useState<any>("")
    const [error, setError] = useState<any>("")
    const [chainId, setChainId] = useState<any>()
    const [network, setNetwork] = useState<any>()
    const [message, setMessage] = useState<any>("")
    const [signedMessage, setSignedMessage] = useState<any>("")
    const [verified, setVerified] = useState<any>()

    const { address, isConnecting, isConnected } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })

    const { openConnectModal } = useConnectModal()
    const { openChainModal } = useChainModal()

    // Connect to wallet
    const connectWallet = async () => {
        try {
            console.log("HERE1")
            useEffect(() => {
                const provider = window.localStorage.getItem("provider")
                if (provider) activate(connectors[provider])
            }, [])
            setLibrary(new ethers.providers.Web3Provider(provider))
            // const library = new ethers.providers.Web3Provider(provider)
            console.log(library, "library")

            const accounts = await library.listAccounts()
            const network = await library.getNetwork()
            console.log("network", network)

            setProvider(provider)
            setLibrary(library)
            if (accounts) setAccount(accounts[0])
            setChainId(network.chainId)
            console.log("chainId", chainId)
        } catch (error) {
            setError(error)
        }
    }

    const handleNetwork = (e: any) => {
        const id = e.target.value
        setNetwork(Number(id))
    }

    const handleInput = (e: any) => {
        const msg = e.target.value
        setMessage(msg)
    }

    const switchNetwork = async () => {}
    //     try {
    //         await library.provider.request({
    //             method: "wallet_switchEthereumChain",
    //             params: [{ chainId: toHex(network) }],
    //         })
    //     } catch (switchError) {
    //         if (switchError.code === 4902) {
    //             try {
    //                 await library.provider.request({
    //                     method: "wallet_addEthereumChain",
    //                     params: [networkParams[toHex(network)]],
    //                 })
    //             } catch (error) {
    //                 setError(error)
    //             }
    //         }
    //     }
    // }

    const signMessage = async () => {}
    //     if (!library) return
    //     try {
    //         const signature = await library.provider.request({
    //             method: "personal_sign",
    //             params: [message, account],
    //         })
    //         setSignedMessage(message)
    //         setSignature(signature)
    //     } catch (error) {
    //         setError(error)
    //     }
    // }

    const verifyMessage = async () => {}
    //     if (!library) return
    //     try {
    //         const verify = await library.provider.request({
    //             method: "personal_ecRecover",
    //             params: [signedMessage, signature],
    //         })
    //         setVerified(verify === account.toLowerCase())
    //     } catch (error) {
    //         setError(error)
    //     }
    // }

    const refreshState = () => {
        setAccount("")
        setChainId("")
        setNetwork("")
        setMessage("")
        setSignature("")
        setVerified(undefined)
    }
    const { disconnect } = useDisconnect()

    useEffect(() => {
        // if (web3Modal.cachedProvider) {
        connectWallet()
        // }
    }, [])

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts: string) => {
                console.log("accountsChanged", accounts)
                if (accounts) setAccount(accounts[0])
            }

            const handleChainChanged = (_hexChainId: string) => {
                setChainId(_hexChainId)
            }

            const handleDisconnect = () => {
                console.log("disconnect", error)
                disconnect()
            }

            provider.on("accountsChanged", handleAccountsChanged)
            provider.on("chainChanged", handleChainChanged)
            provider.on("disconnect", handleDisconnect)

            return () => {
                if (provider.removeListener) {
                    provider.removeListener("accountsChanged", handleAccountsChanged)
                    provider.removeListener("chainChanged", handleChainChanged)
                    provider.removeListener("disconnect", handleDisconnect)
                }
            }
        }
    }, [provider])

    return (
        <Box>
            <ClientOnly>
                {isConnected ? (
                    <Box paddingLeft={10}>
                        <IconButton
                            marginRight={2}
                            onClick={async () => {
                                openChainModal ? openChainModal() : null
                                window!.localStorage.setItem("connected", "injected")
                            }}
                            // disabled={isLoading}
                            aria-label={"Connect wallet"}
                        >
                            <Image src={"./EthereumLogo.svg"}></Image>
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
                                        refreshState()
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
                            // disabled={isLoading}
                            aria-label={"Connect wallet"}
                        >
                            <FontAwesomeIcon icon={faWallet} size={"lg"} />
                        </IconButton>
                    </Box>
                )}
                <Box paddingLeft={10}>
                    <IconButton
                        onClick={async () => {
                            console.log("CLICK")
                            connectWallet()
                        }}
                        aria-label={"Test wallet"}
                    ></IconButton>
                </Box>
            </ClientOnly>
        </Box>
    )
}
