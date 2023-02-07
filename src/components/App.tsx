import styles from "./App.module.css"
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react"
import Header from "./Header"

const App = () => {
    const formBackground = useColorModeValue("gray.100", "gray.700")

    return (
        <>
            <Header></Header>
            <Flex height="50vh" alignItems="center" justifyContent="center">
                <Flex direction="column" background={formBackground} p={12} rounded={6}>
                    <Heading mb={6}>Where's My NFT?</Heading>
                </Flex>
            </Flex>
        </>
    )
}

export default App
