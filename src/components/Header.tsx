import { Box, Flex, HStack, IconButton, useColorModeValue } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"

import ColorModeToggle from "./ColorModeToggle"
import WalletButton from "./WalletButton"
import Link from "next/link"

export default function Header() {
    return (
        <>
            <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack spacing={8} alignItems={"center"}>
                        <Box fontWeight="bold" sx={{ cursor: "default" }}>
                            NFT Image Locator
                        </Box>
                    </HStack>
                    <HStack>
                        <ColorModeToggle />
                        <Link
                            href={"https://github.com/EridianAlpha/nft-image-locator-html"}
                            target="_blank"
                        >
                            <IconButton aria-label={"View GitHub Source"}>
                                <FontAwesomeIcon icon={faGithub} size={"lg"} />
                            </IconButton>
                        </Link>
                        <WalletButton />
                        <Flex alignItems={"center"}></Flex>
                    </HStack>
                </Flex>
            </Box>
        </>
    )
}
