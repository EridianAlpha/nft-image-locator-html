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
    Tooltip,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faWarning } from "@fortawesome/free-solid-svg-icons"
import { useContractRead, useBlockNumber } from "wagmi"

export default function NftForm() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Use refetch to manually test the connection
    const { refetch: blockNumberRefetch } = useBlockNumber()

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

    // State used for connection testing
    const [blockNumberRefetchResponse, setBlockNumberRefetchResponse] = useState<any>()

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
                console.log("Trying through CORS proxy...")
                fetchUriDataProxy(_tokenUri)
            })
    }

    async function fetchUriDataProxy(_tokenUri: any) {
        await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(_tokenUri)}`)
            .then(async (response) => {
                if (!response.ok) {
                    setTokenUriJson(response.statusText)
                    throw new Error(response.statusText)
                } else {
                    const data = await response.json()
                    setTokenUriJson(JSON.parse(data.contents))
                }
            })
            .catch((error) => {
                console.log("error: " + error)
            })
    }

    async function findNFt() {
        setTokenUriJson("Loading")
        const blockNumberResponse = await testRpcConnection()
        setTokenUriJson("Loading")

        if (blockNumberResponse.isSuccess) {
            const response = await contractDataRefetch()
            if (response.isSuccess) {
                setContractData(response.data)
                setTokenUri(response.data)
                fetchUriData(response.data)
            } else {
                setContractData(null)
                setTokenUriJson("NFT Not Found")
            }
        } else {
            setTokenUriJson("RPC Error")
        }
    }

    async function testRpcConnection() {
        setBlockNumberRefetchResponse("Loading")
        const response = await blockNumberRefetch()
        setBlockNumberRefetchResponse(response)

        response.isSuccess ? setTokenUriJson("") : setTokenUriJson("RPC Error")
        return response
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
                                    }}
                                >
                                    {tokenUriJson == "Loading" ? <Spinner /> : "Find NFT"}
                                </Button>
                                <Spacer />
                                <Tooltip
                                    hasArrow
                                    openDelay={300}
                                    placement="bottom"
                                    label="Select RPC Provider"
                                >
                                    <IconButton
                                        //Stops the tooltip opening when modal closes
                                        onFocus={(e) => e.preventDefault()}
                                        onClick={() => {
                                            onOpen()
                                            // If there's an RPC error, don't clear the tokenUriJson so the error is visible when the modal opens
                                            if (tokenUriJson != "RPC Error") {
                                                setBlockNumberRefetchResponse("")
                                            }
                                        }}
                                        aria-label={"Advanced settings"}
                                    >
                                        {tokenUriJson == "RPC Error" ? (
                                            <FontAwesomeIcon
                                                color="red"
                                                icon={faWarning}
                                                size={"lg"}
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faGear} size={"lg"} />
                                        )}
                                    </IconButton>
                                </Tooltip>
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
            <AdvancedSettings
                isOpen={isOpen}
                closeModal={onClose}
                testRpcConnection={testRpcConnection}
                blockNumberRefetchResponse={blockNumberRefetchResponse}
                setBlockNumberRefetchResponse={setBlockNumberRefetchResponse}
                setTokenUriJson={setTokenUriJson}
                tokenUriJson={tokenUriJson}
            />
        </>
    )
}
