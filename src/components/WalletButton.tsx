import { useEffect, useState, useRef } from "react"
// import { networkParams } from "./networks"
import { toHex, truncateAddress } from "../../utils"
import { ethers } from "ethers"
import Web3Modal from "web3modal"
import { providerOptions } from "../../providerOptions"

import {
    Box,
    IconButton,
    Text,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    useColorModeValue,
} from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet } from "@fortawesome/free-solid-svg-icons"

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

    let web3Modal: Web3Modal
    if (typeof window !== "undefined") {
        web3Modal = new Web3Modal({
            cacheProvider: true, // optional - Maintains connection between page refreshes
            providerOptions, // required - MetaMask is the default and if you don't have any other options then the modal won't even appear and it just assumes MetaMask
            theme: useColorModeValue("light", "dark"),
        })
    }

    // Connect to wallet
    const connectWallet = async () => {
        try {
            const provider = await web3Modal.connect()
            const library = new ethers.providers.Web3Provider(provider)
            const accounts = await library.listAccounts()
            const network = await library.getNetwork()
            setProvider(provider)
            setLibrary(library)
            if (accounts) setAccount(accounts[0])
            setChainId(network.chainId)
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

    const disconnect = async () => {
        await web3Modal.clearCachedProvider()
        refreshState()
    }

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet()
        }
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
            {account ? (
                <Box paddingLeft={10}>
                    <Menu>
                        <MenuButton as={IconButton}>
                            <Text margin={3}>{truncateAddress(account)}</Text>
                        </MenuButton>
                        <MenuList>
                            <MenuItem
                                onClick={async () => {
                                    // window.localStorage.removeItem("connected")
                                    // await deactivateWeb3()
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
                            connectWallet()
                            // await enableWeb3()
                            // window!.localStorage.setItem("connected", "injected")
                        }}
                        // disabled={isWeb3EnableLoading}
                        aria-label={"Connect wallet"}
                    >
                        <FontAwesomeIcon icon={faWallet} size={"lg"} />
                    </IconButton>
                </Box>
            )}
        </Box>
    )
}
