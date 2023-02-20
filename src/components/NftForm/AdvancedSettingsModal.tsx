import { useState, useEffect, useContext } from "react"
import TestConnectionButton from "./TestConnectionButton"

import NextLink from "next/link"
import { CustomRpcProviderContext } from "../../utils/context"
import {
    Box,
    Flex,
    Input,
    Button,
    FormControl,
    Code,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Badge,
    Stack,
    RadioGroup,
    Radio,
    FormHelperText,
    Spacer,
    Link,
    Text,
} from "@chakra-ui/react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLink, faFaceFrown, faFaceSmile } from "@fortawesome/free-solid-svg-icons"

import { useProvider, useBlockNumber } from "wagmi"

export type AdvancedSettingsModalProps = {
    isOpen: boolean
    closeModal: () => void
    testRpcConnection: () => void
    blockNumberRefetchResponse: any
    setBlockNumberRefetchResponse: (response: any) => void
    setTokenUriJson: (response: any) => void
    tokenUriJson: any
}

export default function AdvancedSettingsModal({
    isOpen,
    closeModal,
    testRpcConnection,
    blockNumberRefetchResponse,
    setBlockNumberRefetchResponse,
    setTokenUriJson,
    tokenUriJson,
}: AdvancedSettingsModalProps) {
    const isSSR = typeof window === "undefined"
    const provider = useProvider<any>()

    // This variable uses context because it's used in the top level render of the app
    const { customRpcProvider, setCustomRpcProvider } = useContext(CustomRpcProviderContext)

    // Set radio button on open
    const [radioValue, setRadioValue] = useState(
        !isSSR && window?.localStorage.getItem("CustomRpcProvider") ? "custom" : "public"
    )

    useEffect(() => {
        if (radioValue === "public") {
            setCustomRpcProvider("")
            window?.localStorage.removeItem("CustomRpcProvider")
        } else if (radioValue === "custom") {
            if (window?.localStorage.getItem("CustomRpcProvider") && !customRpcProvider) {
                setCustomRpcProvider(window?.localStorage.getItem("CustomRpcProvider"))
            }
        }
        setBlockNumberRefetchResponse(null)
    }, [radioValue])

    useEffect(() => {
        if (radioValue === "custom" && customRpcProvider) {
            window?.localStorage.setItem("CustomRpcProvider", customRpcProvider?.toString())
        }
    }, [customRpcProvider])

    function customProviderInputChange(e) {
        if ((e.target as HTMLInputElement).value) {
            setCustomRpcProvider((e.target as HTMLInputElement).value)
        } else {
            setCustomRpcProvider("")
            window?.localStorage.removeItem("CustomRpcProvider")
        }
    }

    return (
        <>
            <Modal
                size={"lg"}
                isOpen={isOpen}
                onClose={() => {
                    closeModal()
                    // Test on close any warnings are removed if the connection was fixed
                    if (tokenUriJson == "RPC Error") {
                        setTokenUriJson("Loading")
                        testRpcConnection()
                    }
                    setBlockNumberRefetchResponse(null)
                    !customRpcProvider ? setRadioValue("public") : null
                }}
            >
                <ModalOverlay />
                <ModalContent mt={100}>
                    <ModalHeader>Select RPC Provider</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RadioGroup onChange={setRadioValue} value={radioValue}>
                            <Stack>
                                <Radio value="public">
                                    <Flex direction={"row"} wrap={"wrap"} columnGap={"10px"}>
                                        <Box>
                                            <Badge
                                                variant="subtle"
                                                fontSize="0.8em"
                                                colorScheme="yellow"
                                                mb={0.5}
                                            >
                                                Public Provider (Automatic)
                                            </Badge>
                                        </Box>
                                        <Box>
                                            &quot;Trust, don&apos;t verify&quot;{" "}
                                            <FontAwesomeIcon icon={faFaceFrown} />
                                        </Box>
                                    </Flex>
                                </Radio>
                                <FormControl pl={6} mt={0}>
                                    <FormHelperText mt={0}>
                                        A public RPC will be automatically selected and used to
                                        query the blockchain.
                                    </FormHelperText>
                                </FormControl>
                                <Box pt={6}></Box>
                                <Radio value="custom">
                                    <Flex direction={"row"} wrap={"wrap"} columnGap={"10px"}>
                                        <Box>
                                            <Badge
                                                variant="subtle"
                                                fontSize="0.8em"
                                                colorScheme="blue"
                                                mb={0.5}
                                            >
                                                Custom Provider (Manual)
                                            </Badge>
                                        </Box>
                                        <Box>
                                            &quot;Verify, don&apos;t trust&quot;{" "}
                                            <FontAwesomeIcon icon={faFaceSmile} />
                                        </Box>
                                    </Flex>
                                </Radio>
                                <FormControl pl={6}>
                                    <Input
                                        type={"url"}
                                        onFocus={() => {
                                            setRadioValue("custom")
                                        }}
                                        placeholder="https://"
                                        onChange={(e) => customProviderInputChange(e)}
                                        value={customRpcProvider?.toString()}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                                if (radioValue === "custom" && !customRpcProvider) {
                                                    return
                                                } else {
                                                    testRpcConnection()
                                                }
                                            }
                                        }}
                                    />
                                    <FormHelperText>
                                        Specify an RPC that will be used to query the blockchain.
                                        <br />
                                        For example:
                                        <br />- A local node e.g. <Code>localhost:8545</Code>
                                        <br /> - Select from{" "}
                                        <Link
                                            textDecoration={"underline"}
                                            as={NextLink}
                                            href="https://ethereumnodes.com/"
                                            isExternal
                                        >
                                            public RPC providers{" "}
                                            <FontAwesomeIcon icon={faExternalLink} size={"sm"} />
                                        </Link>
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter alignItems={"flex-start"}>
                        {blockNumberRefetchResponse?.failureReason ? (
                            <Box>
                                <FormControl mt={0} pr={3}>
                                    <FormHelperText mt={0} wordBreak={"break-word"}>
                                        {blockNumberRefetchResponse?.failureReason.code ? (
                                            <>
                                                <Badge
                                                    variant="subtle"
                                                    fontSize="0.8em"
                                                    colorScheme="red"
                                                >
                                                    {blockNumberRefetchResponse?.failureReason.code}{" "}
                                                    {
                                                        blockNumberRefetchResponse?.failureReason
                                                            .status
                                                    }
                                                </Badge>
                                                <br />
                                                {/* <br /> */}
                                            </>
                                        ) : null}

                                        {blockNumberRefetchResponse?.failureReason.serverError
                                            ?.message ? (
                                            <>
                                                <br />
                                                {
                                                    blockNumberRefetchResponse?.failureReason
                                                        .serverError?.message
                                                }
                                                <br />
                                            </>
                                        ) : null}
                                        <br />
                                        <Code>{blockNumberRefetchResponse?.failureReason.url}</Code>
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                        ) : null}
                        {blockNumberRefetchResponse?.status == "success" ? (
                            <Box>
                                <FormControl mt={0} pr={3}>
                                    <FormHelperText mt={0} wordBreak={"break-word"}>
                                        Current block:
                                        {"\n"}
                                        <Code>{blockNumberRefetchResponse?.data}</Code>
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                        ) : null}
                        <Spacer />
                        <Box>
                            <Button
                                isDisabled={
                                    radioValue === "custom" &&
                                    (!customRpcProvider || blockNumberRefetchResponse == "Loading")
                                        ? true
                                        : false
                                }
                                colorScheme={blockNumberRefetchResponse?.isError ? "red" : "blue"}
                                onClick={async () => {
                                    if (radioValue === "custom" && !customRpcProvider) {
                                        return
                                    } else {
                                        testRpcConnection()
                                    }
                                }}
                            >
                                <TestConnectionButton
                                    blockNumberRefetchResponse={blockNumberRefetchResponse}
                                />
                            </Button>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
