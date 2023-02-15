import { useState, useEffect, useContext } from "react"
import TestConnectionButton from "./TestConnectionButton"

import { CustomRpcProviderContext } from "../utils/context"
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
    Text,
    HStack,
    Center,
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

import { useContractRead, useProvider, useBlockNumber } from "wagmi"

export type AdvancedSettingsModalProps = {
    isOpen: boolean
    closeModal: () => void
}

export default function AdvancedSettingsModal({ isOpen, closeModal }: AdvancedSettingsModalProps) {
    const provider = useProvider<any>()

    const { customRpcProvider, setCustomRpcProvider } = useContext(CustomRpcProviderContext)

    const {
        data: blockNumber,
        isError: blockNumberError,
        isLoading: blockNumberLoading,
        refetch: blockNumberRefetch,
    } = useBlockNumber()

    const isSSR = typeof window === "undefined"
    const [radioValue, setRadioValue] = useState(
        !isSSR && window?.localStorage.getItem("CustomRpcProvider") ? "custom" : "public"
    )
    const [blockNumberRefetchResponse, setBlockNumberRefetchResponse] = useState<any>()

    useEffect(() => {
        if (radioValue === "public") {
            setCustomRpcProvider("")
            window?.localStorage.removeItem("CustomRpcProvider")
        } else if (radioValue === "custom") {
            if (window?.localStorage.getItem("CustomRpcProvider") && !customRpcProvider) {
                setCustomRpcProvider(window?.localStorage.getItem("CustomRpcProvider"))
            }
        }
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
            <Modal isOpen={isOpen} onClose={closeModal} isCentered>
                <ModalOverlay />
                <ModalContent>
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
                                <FormControl mt={0}>
                                    <FormHelperText mt={0}>
                                        A public RPC <Code>{provider.connection.url}</Code> will be
                                        used to query the blockchain.
                                    </FormHelperText>
                                </FormControl>
                                <Box pt={8}></Box>
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
                                <FormControl>
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
                                        Enter an RPC URL that will be used to query the blockchain.
                                    </FormHelperText>
                                </FormControl>
                            </Stack>
                        </RadioGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Flex>
                            <Button
                                colorScheme="blue"
                                mr={3}
                                onClick={async () => {
                                    //TODO clean this up so it shows a better error (or ideally the button is disabled) when there's no input in the custom provider input
                                    if (radioValue === "custom" && !customRpcProvider) {
                                        return
                                    } else {
                                        setBlockNumberRefetchResponse("Loading")
                                        const response = await blockNumberRefetch()
                                        setBlockNumberRefetchResponse(response)
                                        setTimeout(function () {
                                            setBlockNumberRefetchResponse(null)
                                        }, 3_000)
                                    }
                                }}
                            >
                                <TestConnectionButton
                                    blockNumberRefetchResponse={blockNumberRefetchResponse}
                                />
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
