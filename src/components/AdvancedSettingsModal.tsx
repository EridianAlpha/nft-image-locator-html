import { useState, useEffect, useContext } from "react"
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
} from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContractRead, useProvider } from "wagmi"

export type AdvancedSettingsModalProps = {
    isOpen: boolean
    closeModal: () => void
}

export default function AdvancedSettingsModal({ isOpen, closeModal }: AdvancedSettingsModalProps) {
    const provider = useProvider<any>()

    const { customRpcProvider, setCustomRpcProvider } = useContext(CustomRpcProviderContext)

    const [radioValue, setRadioValue] = useState("public")

    useEffect(() => {
        console.log("Radio Changed")
        console.log("customRpcProvider", customRpcProvider)

        if (radioValue === "public") {
            setCustomRpcProvider(null)
        } else if (radioValue === "custom") {
            setCustomRpcProvider(customRpcProvider?.toString())
        }
    }, [radioValue, customRpcProvider])

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
                                    <Badge variant="subtle" fontSize="0.8em" colorScheme="yellow">
                                        Public Provider
                                    </Badge>
                                </Radio>
                                <FormControl>
                                    <Input
                                        isReadOnly
                                        sx={{
                                            ":hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        onClick={() => {
                                            setRadioValue("public")
                                        }}
                                        value={provider.connection.url}
                                    />
                                    <FormHelperText>
                                        This public RPC URL will be used to query the blockchain.
                                    </FormHelperText>
                                </FormControl>
                                <Box pt={8}></Box>
                                <Radio value="custom">
                                    <Badge variant="subtle" fontSize="0.8em" colorScheme="blue">
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
                                        onInput={(e) =>
                                            setCustomRpcProvider(
                                                (e.target as HTMLInputElement).value
                                            )
                                        }
                                        value={customRpcProvider?.toString()}
                                    />
                                    <FormHelperText>
                                        Enter a custom RPC URL that will be used to query the
                                        blockchain.
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
                                onClick={() => {
                                    console.log("Secondary Action")
                                }}
                            >
                                Test Connection
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
