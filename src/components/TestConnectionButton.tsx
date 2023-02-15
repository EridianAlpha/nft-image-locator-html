import { Spinner, Text } from "@chakra-ui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"

export default function TestConnectionButton({ blockNumberRefetchResponse }) {
    if (!blockNumberRefetchResponse) {
        return <Text>Test Connection</Text>
    } else if (blockNumberRefetchResponse === "Loading") {
        return (
            <>
                <Spinner size="sm" />
                <Text pl={2}>Testing connection...</Text>
            </>
        )
    } else if (blockNumberRefetchResponse.isSuccess) {
        return (
            <>
                <FontAwesomeIcon icon={faCircleCheck} size={"lg"} />
                <Text pl={2}>Connection successful</Text>
            </>
        )
    } else if (blockNumberRefetchResponse.isError) {
        return (
            <>
                <Text color="red.500">Connection failed</Text>
            </>
        )
    }
}
