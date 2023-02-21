import { useState, useEffect } from "react"
import AdvancedSettings from "./AdvancedSettingsModal"
import NftImage from "./NftImage"
import { chainName, chainIcon } from "../../utils/chainDetails"
import Examples from "./Examples"
import { fetchUriData } from "../../utils/fetchUriData"

import {
    Box,
    Text,
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
    Container,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGear, faWarning, faWallet } from "@fortawesome/free-solid-svg-icons"
import { useContractRead, useBlockNumber } from "wagmi"

import { useNetwork, useProvider, useAccount } from "wagmi"
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit"

export default function NftForm({ windowSize }) {
    // Check if the current render is on the server (Server Side Render) or client
    const isSSR = typeof window === "undefined"

    // Get modal open/close functions
    const { isOpen, onOpen, onClose } = useDisclosure()

    // Use refetch to manually test the connection
    const { refetch: blockNumberRefetch } = useBlockNumber()

    // Get wallet functions
    const { chain } = useNetwork()
    const provider = useProvider()
    const { isConnected } = useAccount()
    const { openChainModal } = useChainModal()
    const { openConnectModal } = useConnectModal()

    // Variables
    const formBackground = useColorModeValue("gray.100", "gray.700")
    const contractAbi = ["function tokenURI(uint256 tokenId) view returns (string)"]
    const contractFunctionName = "tokenURI"

    // Get values from URL params
    let urlParams: URLSearchParams
    let urlContractInput: string | null
    let urlTokenIdInput: string | null
    let urlFindNft: string | null
    if (!isSSR) {
        urlParams = new URLSearchParams(window.location.search)
        urlContractInput = urlParams.get("contract")
        urlTokenIdInput = urlParams.get("tokenId")
        urlFindNft = urlParams.get("findNft")
    }

    // USE STATE
    const [contractInput, setContractInput] = useState<any>(urlContractInput || "")
    const [tokenIdInput, setTokenIdInput] = useState<any>(urlTokenIdInput || "")
    const [tokenUri, setTokenUri] = useState<any>()
    const [tokenUriJson, setTokenUriJson] = useState<any>()
    const [contractData, setContractData] = useState<any>()

    // State used for connection testing
    const [blockNumberRefetchResponse, setBlockNumberRefetchResponse] = useState<any>()

    // Read the contract data, using refetch to manually trigger
    // rather than only on change or load
    const { refetch: contractDataRefetch } = useContractRead({
        address: contractInput,
        abi: contractAbi,
        functionName: contractFunctionName,
        args: [tokenIdInput],
    })

    // Update url params when inputs change
    useEffect(() => {
        if (!isSSR) {
            urlParams.set("contract", contractInput)
            urlParams.set("tokenId", tokenIdInput)
            window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`)
        }
    }, [contractInput, tokenIdInput])

    // Run findNft when url param is set to true
    useEffect(() => {
        if (urlFindNft === "true") {
            findNFt()
        }
    }, [urlFindNft])

    async function findNFt() {
        // Set to "Loading" before and after testing the connection
        // so the spinner is shown and user can't click the button again
        setTokenUriJson("Loading")
        const blockNumberResponse = await testRpcConnection()
        setTokenUriJson("Loading")

        if (blockNumberResponse.isSuccess) {
            const response = await contractDataRefetch()
            console.log("response", response)

            if (response.isSuccess) {
                setContractData(response.data)
                setTokenUri(response.data)
                setTokenUriJson(await fetchUriData(response.data))
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
                <Flex pt={10} pr={0} alignItems="center" justifyContent="center">
                    <Container padding={0} minW="300px" maxW={"700px"}>
                        <Flex
                            direction="column"
                            background={formBackground}
                            px={windowSize.width > 600 ? 16 : 8}
                            py={8}
                            rounded={windowSize.width > 540 ? 15 : 0}
                        >
                            <Heading textAlign={"center"} mb={6}>
                                Where&apos;s My NFT?
                            </Heading>
                            <Examples
                                contractInput={contractInput}
                                tokenIdInput={tokenIdInput}
                                setContractInput={setContractInput}
                                setTokenIdInput={setTokenIdInput}
                                findNFt={findNFt}
                            />
                            <Flex
                                direction="column"
                                minWidth="max-content"
                                alignItems="center"
                                gap="5"
                            >
                                <FormControl pt={8}>
                                    <FormLabel>Network:</FormLabel>
                                    {isConnected &&
                                    // walletConnected &&
                                    window.localStorage.getItem("connected") ? (
                                        <Button
                                            marginRight={2}
                                            paddingLeft={2}
                                            paddingRight={2}
                                            onClick={async () => {
                                                openChainModal ? openChainModal() : null
                                            }}
                                            aria-label={"Change network"}
                                        >
                                            <Image src={chainIcon(chain, provider)}></Image>
                                            <Text marginLeft={2}>{chainName(chain, provider)}</Text>
                                        </Button>
                                    ) : (
                                        <Flex direction={"row"} wrap={"wrap"}>
                                            <Button
                                                isDisabled={true}
                                                marginRight={2}
                                                paddingLeft={2}
                                                paddingRight={2}
                                                aria-label={"Change network"}
                                            >
                                                <Image src={"./EthereumLogo.svg"}></Image>
                                                <Text marginLeft={2}>{"Ethereum Mainnet"}</Text>
                                            </Button>
                                            <Tooltip
                                                hasArrow
                                                openDelay={100}
                                                placement="top"
                                                label="Connect wallet to change network"
                                            >
                                                <IconButton
                                                    onClick={async () => {
                                                        openConnectModal ? openConnectModal() : null
                                                        window!.localStorage.setItem(
                                                            "connected",
                                                            "injected"
                                                        )
                                                    }}
                                                    aria-label={"Connect wallet network"}
                                                >
                                                    <FontAwesomeIcon icon={faWallet} size={"lg"} />
                                                </IconButton>
                                            </Tooltip>
                                        </Flex>
                                    )}
                                </FormControl>
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
                                        placement="top"
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
                    </Container>
                </Flex>
                {tokenUriJson?.image && <NftImage src={tokenUriJson.image} />}
                {tokenUriJson && tokenUriJson !== "Loading" && (
                    <Box
                        pt={5}
                        pb={20}
                        maxWidth={windowSize.width > 540 ? "90%" : "100%"}
                        overflow={"scroll"}
                    >
                        <Code rounded={windowSize.width > 540 ? 15 : 0} p={5}>
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
