import {
    VStack,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Image,
} from "@chakra-ui/react"
import { useConnect } from "wagmi"

import { client } from "../utils/connectors"

const connectors = client.connectors

export type SelectWalletModalProps = {
    isOpen: boolean
    closeModal: () => void
}

export default function SelectWalletModal({ isOpen, closeModal }: SelectWalletModalProps) {
    const { connect, error, isLoading, pendingConnector } = useConnect()

    return (
        <Modal isOpen={isOpen} onClose={closeModal} isCentered>
            <ModalOverlay />
            <ModalContent w="300px" rounded={20}>
                <ModalHeader>Connect a Wallet</ModalHeader>
                <ModalCloseButton
                    _focus={{
                        boxShadow: "none",
                    }}
                    sx={{ marginTop: "7px" }}
                />
                <ModalBody paddingBottom="1.5rem">
                    <VStack>
                        {connectors.map((connector) => (
                            <Button
                                variant="outline"
                                key={connector.id}
                                disabled={!connector.ready}
                                onClick={() => {
                                    connect({ connector })
                                    closeModal()
                                }}
                                w="100%"
                            >
                                <HStack w="100%" justifyContent="center">
                                    <Image
                                        width={26}
                                        height={26}
                                        borderRadius="3px"
                                        src={walletIcons(connector.name)}
                                        alt={"Wallet"}
                                    ></Image>
                                    <Text>
                                        {connector.name}{" "}
                                        {isLoading &&
                                            connector.id === pendingConnector?.id &&
                                            " (connecting)"}
                                    </Text>
                                </HStack>
                            </Button>
                        ))}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

function walletIcons(walletName: string) {
    if (walletName === "MetaMask") {
        return "mm.png"
    } else if (walletName === "Coinbase Wallet") {
        return "/cbw.png"
    } else if (walletName === "WalletConnect") {
        return "/wc.png"
    }
}