import { useState, useEffect } from "react"

import { Image, Text, Flex, Center } from "@chakra-ui/react"

export default function Examples({
    contractInput,
    tokenIdInput,
    setContractInput,
    setTokenIdInput,
    findNFt,
}) {
    const [urlParamExample, setUrlParamExample] = useState<any>()

    // Set all params when example is clicked
    function updateParams(exampleNumber: string) {
        setUrlParamExample(exampleNumber)
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set("contract", contractInput)
        urlParams.set("tokenId", tokenIdInput)
        urlParams.set("findNft", "true")
        urlParams.set("example", exampleNumber)
        window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`)
        findNFt()
    }

    // On page load, if there is an example param,
    // use it to set the border of the selected example
    const isSSR = typeof window === "undefined"
    useEffect(() => {
        if (!isSSR && !urlParamExample) {
            const urlParams = new URLSearchParams(window.location.search)
            // If the content of the inputs matches the example,
            // then set the example param
            examples.map((example) => {
                if (
                    example.example == urlParams.get("example") &&
                    contractInput == example.contractInput &&
                    tokenIdInput == example.tokenIdInput
                ) {
                    setUrlParamExample(urlParams.get("example"))
                }
            })
        }
    }, [contractInput, tokenIdInput, urlParamExample])

    const examples = [
        {
            contractInput: "0x3fc4e77484bfd2397dbed70865aae00174eeb7b6",
            tokenIdInput: "481368551588",
            example: "1",
            src: "https://8biticon.com/static/images/tokens/481368551588.png",
        },
        {
            contractInput: "0x880af717abba38f31ca21673843636a355fb45f3",
            tokenIdInput: "191",
            example: "2",
            src: "https://i.seadn.io/gae/osFzhiSnm23HAQF5tCO2_OOChMYMLe4L7ACsFo4c6NWyG1ZPl7JeqJXdCxkOVL_fkcCh9-TI7bYo9fBNI665fE5EFKyfYWXOjFkrsA?auto=format&w=1000",
        },
        {
            contractInput: "0x48db94c563115cb0e17c360d609aa5cb72bbc624",
            tokenIdInput: "748",
            example: "3",
            src: "https://supernormal-autoreveal-trey1k1k.s3.us-east-2.amazonaws.com/749.jpg",
        },
        {
            contractInput: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
            tokenIdInput: "100",
            example: "4",
            src: "https://i.seadn.io/gcs/files/a55f9d8aab226d601874bf7593649549.png?auto=format&w=1000",
        },
        {
            contractInput: "TODO-POAP",
            tokenIdInput: "4244942",
            example: "5",
            src: "https://assets.poap.xyz/2022-bankless-badge-2022-logo-1643686754396.png",
        },
    ]

    useEffect(() => {
        // If the inputs change, but they don't equal the example, remove the example param
        if (urlParamExample) {
            // write a for each loop over examples array
            // if the contractInput and tokenIdInput match the example, then don't delete the param
            // else delete the param

            examples.forEach((example) => {
                console.log("HERE1")
                const urlParams = new URLSearchParams(window.location.search)
                if (
                    urlParamExample == example.example &&
                    (contractInput !== example.contractInput ||
                        tokenIdInput !== example.tokenIdInput)
                ) {
                    console.log("HERE2")

                    urlParams.delete("example")
                    window.history.replaceState({}, "", `${window.location.pathname}?${urlParams}`)
                    setUrlParamExample(null)
                }
            })
        }
    }, [contractInput, tokenIdInput])

    return (
        <>
            <Center>
                <Text as="b" fontSize="xl">
                    Examples
                </Text>
            </Center>
            <Flex pt={3} direction={"row"} justifyContent={"space-around"}>
                {examples.map((example) => (
                    <Image
                        key={example.example}
                        onClick={async () => {
                            setContractInput(example.contractInput)
                            setTokenIdInput(example.tokenIdInput)
                            updateParams(example.example)
                        }}
                        cursor="pointer"
                        border={urlParamExample == example.example ? "2px solid white" : "none"}
                        marginLeft={3}
                        boxSize="45px"
                        borderRadius="full"
                        mr="12px"
                        src={example.src}
                        _hover={{ border: "2px solid white" }}
                    />
                ))}
            </Flex>
        </>
    )
}
