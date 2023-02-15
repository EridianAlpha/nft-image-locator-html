import styles from "./App.module.css"
import { Flex, Heading, IconButton, useColorModeValue } from "@chakra-ui/react"
import Header from "./Header/Header"
import NftForm from "./NftForm/NftForm"

const App = () => {
    const formBackground = useColorModeValue("gray.100", "gray.700")

    return (
        <>
            <Header></Header>
            <NftForm></NftForm>
        </>
    )
}

export default App
