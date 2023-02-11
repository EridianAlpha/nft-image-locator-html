import React, { useEffect, useState, useContext } from "react"
import { toHex, truncateAddress } from "../utils/utils"

import { WalletConnectedContext } from "../utils/context"

import ClientOnly from "./ClientOnly"

import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useProvider, useNetwork } from "wagmi"

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
    MenuDivider,
} from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet, faCopy, faCircleCheck } from "@fortawesome/free-solid-svg-icons"

export default function WalletButtonMenu() {
    // Everything comes from Wagmi
    const provider = useProvider()
    const { address, isConnected, status } = useAccount()
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })

    const { walletConnected, setWalletConnected } = useContext(WalletConnectedContext)

    // UseState to store the icon used for copying the address
    const [copyIcon, setCopyIcon] = useState(<FontAwesomeIcon icon={faCopy} size={"lg"} />)

    return (
        <MenuList>
            <MenuItem
                closeOnSelect={false}
                command={copyIcon}
                icon={<FontAwesomeIcon icon={faWallet} size={"lg"} />}
                onClick={async () => {
                    console.log("Clicked")
                    setCopyIcon(<FontAwesomeIcon icon={faCircleCheck} size={"lg"} color="green" />)
                }}
            >
                {truncateAddress(address)}
            </MenuItem>
            <MenuDivider />
            <MenuItem
                onClick={async () => {
                    window.localStorage.removeItem("connected")
                    disconnect()
                    setWalletConnected(false)
                }}
            >
                Disconnect
            </MenuItem>
        </MenuList>
    )
}
