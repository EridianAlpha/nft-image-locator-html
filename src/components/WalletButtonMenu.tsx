import React, { useContext } from "react"
import { truncateAddress } from "../utils/utils"

import { WalletConnectedContext } from "../utils/context"

import { useAccount, useDisconnect, useEnsAvatar, useEnsName, useProvider, useNetwork } from "wagmi"

import { useColorModeValue, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWallet, faCircleCheck, faCopy } from "@fortawesome/free-solid-svg-icons"

export default function WalletButtonMenu({
    copyIcon,
    setCopyIcon,
}: {
    copyIcon: any
    setCopyIcon: any
}) {
    // Everything comes from Wagmi
    const provider = useProvider()
    const { address, isConnected, status } = useAccount()
    const { disconnect } = useDisconnect()
    const { chain } = useNetwork()
    const { data: ensAvatar } = useEnsAvatar({ address })
    const { data: ensName } = useEnsName({ address })

    const { walletConnected, setWalletConnected } = useContext(WalletConnectedContext)

    const checkIconColor = useColorModeValue("green", "#03ee03")

    return (
        <MenuList>
            <MenuItem
                closeOnSelect={false}
                //@ts-ignore
                command={copyIcon}
                onClick={async () => {
                    navigator.clipboard.writeText(address)
                    setCopyIcon(
                        <FontAwesomeIcon icon={faCircleCheck} size={"lg"} color={checkIconColor} />
                    )
                    setTimeout(function () {
                        setCopyIcon(<FontAwesomeIcon icon={faCopy} size={"lg"} />)
                    }, 1500)
                }}
            >
                {truncateAddress(address, "long")}
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
