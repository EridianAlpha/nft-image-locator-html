import { Box, Flex, HStack, IconButton, useColorModeValue, Image } from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"

import ColorModeToggle from "./ColorModeToggle"
import WalletButton from "./WalletButton"
import Link from "next/link"

export default function Header({ windowSize }) {
    const isSSR = typeof window === "undefined"

    function navigateHome() {
        if (!isSSR) {
            window.history.replaceState({}, "", `${window.location.pathname}`)
            window.location.reload()
        }
    }

    return (
        <>
            <Box bg={useColorModeValue("gray.100", "gray.900")} pl={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <HStack spacing={3} alignItems={"center"}>
                        <Image
                            onClick={navigateHome}
                            sx={{ cursor: "pointer" }}
                            width={"40px"}
                            objectFit={"cover"}
                            src={"./logo.png"}
                        />
                        <Box
                            pr={2}
                            minW="150px"
                            fontWeight="bold"
                            fontSize="xl"
                            sx={{ cursor: "default" }}
                        >
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
                        <WalletButton windowSize={windowSize} />
                        <Flex alignItems={"center"}></Flex>
                    </HStack>
                </Flex>
            </Box>
        </>
    )
}
