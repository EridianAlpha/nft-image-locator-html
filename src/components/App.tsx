import { useState, useEffect } from "react"
import styles from "./App.module.css"
import { useColorModeValue } from "@chakra-ui/react"
import Header from "./Header/Header"
import NftForm from "./NftForm/NftForm"

const App = () => {
    // Check if the current render is on the server (Server Side Render) or client
    const isSSR = typeof window === "undefined"

    // Rerender when window size changes and save
    // window size to state to allow conditional rendering
    const [windowSize, setWindowSize] = useState({
        width: isSSR ? 0 : window.innerWidth,
        height: isSSR ? 0 : window.innerHeight,
    })
    useEffect(() => {
        const handleResizeWindow = () =>
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow)
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow)
        }
    }, [])

    return (
        <>
            <Header windowSize={windowSize} />
            <NftForm windowSize={windowSize} />
        </>
    )
}

export default App
