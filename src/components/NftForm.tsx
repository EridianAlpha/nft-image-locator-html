import { useState, useEffect } from "react"
import AdvancedSettings from "./AdvancedSettingsModal"
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
    Image,
    IconButton,
    Spacer,
    useDisclosure,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear } from "@fortawesome/free-solid-svg-icons"
import { useContractRead } from "wagmi"

export default function NftForm() {
    const { isOpen, onOpen, onClose } = useDisclosure()

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
    const [contractData, setContractData] = useState<any>()

    const { refetch: contractDataRefetch } = useContractRead({
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

    async function fetchUriData(_tokenUri: any) {
        setTokenUriJson("Loading")
        await fetch(_tokenUri)
            .then(async (response) => {
                if (!response.ok) {
                    setTokenUriJson(response.statusText)
                    throw new Error(response.statusText)
                } else {
                    setTokenUriJson(await response.json())
                }
            })
            .catch((error) => {
                console.log("error: " + error)
            })
    }

    async function findNFt() {
        const response = await contractDataRefetch()
        console.log("response:", response)

        // Test the connection here to check it works before trying to get the contract data

        if (response.isSuccess) {
            setContractData(response.data)
            setTokenUri(response.data)
            fetchUriData(response.data)
        } else {
            setContractData(null)
            setTokenUriJson("NFT Not Found")
        }
    }

    return (
        <>
            <Flex alignItems="center" direction="column">
                <Flex paddingTop={10} alignItems="center" justifyContent="center">
                    <Flex
                        direction="column"
                        background={formBackground}
                        px={16}
                        py={8}
                        rounded={15}
                    >
                        <Heading textAlign={"center"} mb={6}>
                            Where&apos;s My NFT?
                        </Heading>
                        <Flex direction="column" minWidth="max-content" alignItems="center" gap="5">
                            <FormControl>
                                <FormLabel>Contract Address:</FormLabel>
                                <Input
                                    placeholder="0x..."
                                    value={contractInput}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            findNFt()
                                        }
                                    }}
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
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            findNFt()
                                        }
                                    }}
                                    onInput={(e) =>
                                        setTokenIdInput((e.target as HTMLInputElement).value)
                                    }
                                ></Input>
                            </FormControl>

                            <Flex minWidth="100%">
                                <Box width={"40px"} />
                                <Spacer />
                                <Button
                                    isDisabled={tokenUriJson == "Loading" ? true : false}
                                    colorScheme="teal"
                                    onClick={() => {
                                        findNFt()
                                        // fetchUriData()
                                        // console.log("contractData", contractData)
                                        // console.log("tokenUriJson", tokenUriJson)
                                    }}
                                >
                                    {tokenUriJson == "Loading" ? <Spinner /> : "Find NFT"}
                                </Button>
                                <Spacer />
                                <IconButton onClick={onOpen} aria-label={"Advanced settings"}>
                                    <FontAwesomeIcon icon={faGear} size={"lg"} />
                                </IconButton>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                {tokenUriJson?.image && (
                    <Image
                        mt={5}
                        borderRadius="full"
                        boxSize="200px"
                        alt="NFT Image"
                        src={tokenUriJson.image}
                    />
                )}
                {tokenUriJson && tokenUriJson !== "Loading" && (
                    <Box pt={5} pb={20} maxWidth={"90%"} overflow={"scroll"}>
                        <Code rounded={15} p={5}>
                            <pre>{JSON.stringify(tokenUriJson, null, 2)}</pre>
                        </Code>
                    </Box>
                )}
            </Flex>
            <AdvancedSettings isOpen={isOpen} closeModal={onClose} />
        </>
    )
}
