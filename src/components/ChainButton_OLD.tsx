import { useEffect, useState } from "react"
import { toHex, truncateAddress } from "../../utils"
import { ethers } from "ethers"

import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from "wagmi"

import WalletButtonModal from "./WalletButtonModal"

import "@rainbow-me/rainbowkit/styles.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"

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

export default function ChainButton() {
    return (
        <ConnectButton
            accountStatus="avatar"
            chainStatus={{
                smallScreen: "icon",
                largeScreen: "icon",
            }}
            showBalance={false}
        />
    )
}
