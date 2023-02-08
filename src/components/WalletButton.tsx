import { useEffect, useState } from "react"
import { toHex, truncateAddress } from "../../utils"
import { ethers } from "ethers"

import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi"

import WalletButtonModal from "./WalletButtonModal"

import {
    Box,
    IconButton,
    Text,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    useDisclosure,
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

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { address, connector, isConnected } = useAccount()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })

    const { connect, connectors, isLoading, pendingConnector } = useConnect()

    // Connect to wallet
    const connectWallet = async () => {
        try {
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
            {isConnected ? (
                <Box paddingLeft={10}>
                    <Menu>
                        <MenuButton as={IconButton}>
                            <Text margin={3}>{truncateAddress(address)}</Text>
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
                            onOpen()
                            window!.localStorage.setItem("connected", "injected")
                        }}
                        // disabled={isLoading}
                        aria-label={"Connect wallet"}
                    >
                        <FontAwesomeIcon icon={faWallet} size={"lg"} />
                    </IconButton>
                </Box>
            )}
            <WalletButtonModal isOpen={isOpen} closeModal={onClose} />
        </Box>
    )
}
