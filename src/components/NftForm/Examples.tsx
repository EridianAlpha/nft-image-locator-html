import { Image, Link, Text, Flex, Center } from "@chakra-ui/react"

export default function Examples() {
    return (
        <>
            <Center>
                <Text as="b" fontSize="xl">
                    Examples
                </Text>
            </Center>
            <Flex pt={3} direction={"row"} justifyContent={"space-around"}>
                <Link href="/?contract=0x3fc4e77484bfd2397dbed70865aae00174eeb7b6&tokenId=481368551588&findNft=true#">
                    <Image
                        marginLeft={3}
                        boxSize="3rem"
                        borderRadius="full"
                        mr="12px"
                        src={"https://8biticon.com/static/images/tokens/481368551588.png"}
                    ></Image>
                </Link>
                <Link href="/?contract=0x880af717abba38f31ca21673843636a355fb45f3&tokenId=191&findNft=true#">
                    <Image
                        marginLeft={3}
                        boxSize="3rem"
                        borderRadius="full"
                        mr="12px"
                        src={
                            "https://i.seadn.io/gae/osFzhiSnm23HAQF5tCO2_OOChMYMLe4L7ACsFo4c6NWyG1ZPl7JeqJXdCxkOVL_fkcCh9-TI7bYo9fBNI665fE5EFKyfYWXOjFkrsA?auto=format&w=1000"
                        }
                    ></Image>
                </Link>
                <Link href="/?contract=0x48db94c563115cb0e17c360d609aa5cb72bbc624&tokenId=748&findNft=true#">
                    <Image
                        marginLeft={3}
                        boxSize="3rem"
                        borderRadius="full"
                        mr="12px"
                        src={
                            "https://supernormal-autoreveal-trey1k1k.s3.us-east-2.amazonaws.com/749.jpg"
                        }
                    ></Image>
                </Link>
                <Link href="/?contract=0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb&tokenId=100&findNft=true#">
                    <Image
                        marginLeft={3}
                        boxSize="3rem"
                        borderRadius="full"
                        mr="12px"
                        src={
                            "https://i.seadn.io/gcs/files/a55f9d8aab226d601874bf7593649549.png?auto=format&w=1000"
                        }
                    ></Image>
                </Link>
                <Link href="/?contract=TODO-POAP&tokenId=4244942&findNft=true#">
                    <Image
                        marginLeft={3}
                        boxSize="3rem"
                        borderRadius="full"
                        mr="12px"
                        src={
                            "https://assets.poap.xyz/2022-bankless-badge-2022-logo-1643686754396.png"
                        }
                    ></Image>
                </Link>
            </Flex>
        </>
    )
}
