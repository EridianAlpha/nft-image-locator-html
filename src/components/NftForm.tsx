import { useState, useEffect } from "react"
import {
    Box,
    Flex,
    Heading,
    Input,
    useColorModeValue,
    Button,
    FormControl,
    FormLabel,
    Code,
    Spinner,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ColorModeToggle from "./ColorModeToggle"
import { useContractRead } from "wagmi"

export default function NftForm() {
    const formBackground = useColorModeValue("gray.100", "gray.700")

    const contractAbi = ["function tokenURI(uint256 tokenId) view returns (string)"]

    // Retrieve local storage values
    let localContractInput: string | null
    let localTokenIdInput: string | null
    const isSSR = typeof window === "undefined"
    if (!isSSR) {
        localContractInput = window.localStorage.getItem("contractInput")
        localTokenIdInput = window.localStorage.getItem("tokenIdInput")
    }

    // USE STATE
    const [contractInput, setContractInput] = useState<any>(localContractInput || "")
    const [tokenIdInput, setTokenIdInput] = useState<any>(localTokenIdInput || "")
    const [tokenUri, setTokenUri] = useState<any>()
    const [tokenUriJson, setTokenUriJson] = useState<any>()

    const { data, isError, isLoading } = useContractRead({
        address: contractInput,
        abi: contractAbi,
        functionName: "tokenURI",
        args: [tokenIdInput],
    })

    useEffect(() => {
        if (window) {
            window!.localStorage.setItem("contractInput", contractInput)
            window!.localStorage.setItem("tokenIdInput", tokenIdInput)
        }
    }, [contractInput, tokenIdInput])

    useEffect(() => {
        setTokenUri(data)
    }, [data])

    async function fetchUriData() {
        setTokenUriJson("Loading")
        await fetch(tokenUri)
            .then(async (response) => {
                if (!response.ok) throw new Error(response.statusText)
                else setTokenUriJson(await response.json())
            })
            .catch((error) => {
                console.log("error: " + error)
            })
    }

    return (
        <Flex alignItems="center" direction="column">
            <Flex paddingTop={10} alignItems="center" justifyContent="center">
                <Flex direction="column" background={formBackground} px={16} py={8} rounded={15}>
                    <Heading mb={6}>Where&apos;s My NFT?</Heading>
                    <Flex direction="column" minWidth="max-content" alignItems="center" gap="5">
                        <FormControl>
                            <FormLabel>Contract Address:</FormLabel>
                            <Input
                                placeholder="0x..."
                                value={contractInput}
                                onInput={(e) =>
                                    setContractInput((e.target as HTMLInputElement).value)
                                }
                            ></Input>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Token ID:</FormLabel>
                            <Input
                                placeholder="12345"
                                value={tokenIdInput}
                                onInput={(e) =>
                                    setTokenIdInput((e.target as HTMLInputElement).value)
                                }
                            ></Input>
                        </FormControl>

                        <Button
                            colorScheme="teal"
                            onClick={() => {
                                fetchUriData()
                                console.log("data", data)
                                console.log("tokenUriJson", tokenUriJson)
                            }}
                        >
                            {tokenUriJson == "Loading" ? <Spinner /> : "Find NFT"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
            {tokenUriJson && tokenUriJson !== "Loading" && (
                <Box pt={5} pb={20} maxWidth={"90%"} overflow={"scroll"}>
                    <Code rounded={15} p={5}>
                        <pre>{JSON.stringify(tokenUriJson, null, 2)}</pre>
                    </Code>
                </Box>
            )}
        </Flex>
    )
}
