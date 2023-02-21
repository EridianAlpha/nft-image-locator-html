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
        if (!isSSR) {
            const urlParams = new URLSearchParams(window.location.search)
            if (urlParamExample) {
                examples.forEach((example) => {
                    if (
                        urlParamExample == example.example &&
                        (contractInput !== example.contractInput ||
                            tokenIdInput !== example.tokenIdInput)
                    ) {
                        urlParams.delete("example")
                        window.history.replaceState(
                            {},
                            "",
                            `${window.location.pathname}?${urlParams}`
                        )
                        setUrlParamExample(null)
                    }
                })
            } else {
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
            contractInput: "0xd9b78a2f1dafc8bb9c60961790d2beefebee56f4",
            tokenIdInput: "7013",
            example: "2",
            src: "https://i.seadn.io/gae/HtMUqt4dLbLfGBDWscXwuoIGkkZYCB1bA4QgYw1UUERBkEu5g7Dgy8RFpc6XIpyPEb4OK6entlPFlRKbxABeUtYONxXEnmXFaSg7?auto=format&w=1000",
        },
        {
            contractInput: "0x48db94c563115cb0e17c360d609aa5cb72bbc624",
            tokenIdInput: "748",
            example: "3",
            src: "https://supernormal-autoreveal-trey1k1k.s3.us-east-2.amazonaws.com/749.jpg",
        },
        {
            contractInput: "0x282bdd42f4eb70e7a9d9f40c8fea0825b7f68c5d",
            tokenIdInput: "5691",
            example: "4",
            src: "https://ipfs.io/ipfs/QmbEkz9dzPXBtphM36oCYnNDLGMdt3jFxqf34VZfKG7ZHM",
        },
        {
            contractInput: "0x22C1f6050E56d2876009903609a2cC3fEf83B415",
            tokenIdInput: "4244942",
            example: "5",
            src: "https://assets.poap.xyz/2022-bankless-badge-2022-logo-1643686754396.png",
        },
        {
            contractInput: "0x5755ab845ddeab27e1cfce00cd629b2e135acc3d",
            tokenIdInput: "2384",
            example: "6",
            src: "https://openseauserdata.com/files/322618c561f2a308fff0e3c75b980fc1.svg",
        },
        {
            contractInput: "0x0c60b40289ff15ff6afdfa668d1a743dc6e53cf3",
            tokenIdInput: "210",
            example: "7",
            src: "https://afundamentaldispute.com/api/art-placeholder/210?942885128141190395537709756960567882489310811254",
        },
    ]

    return (
        <>
            <Center>
                <Text as="b" fontSize="xl">
                    Examples
                </Text>
            </Center>
            <Flex
                pt={3}
                direction={"row"}
                justifyContent={"space-around"}
                wrap={"wrap"}
                rowGap={"20px"}
            >
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
                        objectFit="cover"
                        boxSize="55px"
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
