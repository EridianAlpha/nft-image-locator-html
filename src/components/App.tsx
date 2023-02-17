import styles from "./App.module.css"
import { useColorModeValue } from "@chakra-ui/react"
import Header from "./Header/Header"
import NftForm from "./NftForm/NftForm"

const App = () => {
    return (
        <>
            <Header />
            <NftForm />
        </>
    )
}

export default App
