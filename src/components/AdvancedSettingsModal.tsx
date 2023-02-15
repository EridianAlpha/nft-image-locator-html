import { useState, useEffect, useContext } from "react"
import TestConnectionButton from "./TestConnectionButton"

import { CustomRpcProviderContext } from "../utils/context"
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
} from "@chakra-ui/react"

import { useProvider, useBlockNumber } from "wagmi"

export type AdvancedSettingsModalProps = {
    isOpen: boolean
    closeModal: () => void
    testRpcConnection: () => void
    blockNumberRefetchResponse: any
    setBlockNumberRefetchResponse: (response: any) => void
}

export default function AdvancedSettingsModal({
    isOpen,
    closeModal,
    testRpcConnection,
    blockNumberRefetchResponse,
    setBlockNumberRefetchResponse,
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
                                    <Badge
                                        variant="subtle"
                                        fontSize="0.8em"
                                        colorScheme="yellow"
                                        mb={0.5}
                                    >
                                        Public Provider
                                    </Badge>
                                </Radio>
                                <FormControl pl={6} mt={0}>
                                    <FormHelperText mt={0}>
                                        A public RPC will be used to query the blockchain.
                                    </FormHelperText>
                                </FormControl>
                                <Box pt={6}></Box>
                                <Radio value="custom">
                                    <Badge
                                        variant="subtle"
                                        fontSize="0.8em"
                                        colorScheme="blue"
                                        mb={0.5}
                                    >
                                        Custom Provider
                                    </Badge>
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
                                    />
                                    <FormHelperText>
                                        Enter an RPC that will be used to query the blockchain.
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
                                <FormControl pl={6} mt={0} pr={3}>
                                    <FormHelperText mt={0} wordBreak={"break-word"}>
                                        Current block number:
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
