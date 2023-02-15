import { useContext, useEffect } from "react"
import { ThemeContext } from "../../utils/context"

import { Button, ButtonProps, Flex, useColorMode } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons"

export default function ColorModeToggle(props: ButtonProps) {
    const { theme, setTheme } = useContext(ThemeContext)
    const { colorMode, toggleColorMode } = useColorMode()

    useEffect(() => {
        setTheme(colorMode === "light" ? "lightTheme" : "darkTheme"), [colorMode]
    })

    return (
        <Flex h="100vh" justifyContent="center" alignItems="center">
            <Button
                aria-label="Toggle Color Mode"
                onClick={() => {
                    toggleColorMode()
                    setTheme(colorMode === "light" ? "darkTheme" : "lightTheme")
                }}
                _focus={{ boxShadow: "none" }}
                w="fit-content"
                {...props}
            >
                {colorMode === "light" ? (
                    <FontAwesomeIcon icon={faMoon} size={"lg"} />
                ) : (
                    <FontAwesomeIcon icon={faSun} size={"lg"} />
                )}
            </Button>
        </Flex>
    )
}
