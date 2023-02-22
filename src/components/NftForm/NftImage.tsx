import { Box, Image } from "@chakra-ui/react"

export default function NftImage({ tokenUriJson }: { tokenUriJson: any }) {
    // POAP uses .image_url instead of the ERC-721 .image standard
    let src: any
    if (tokenUriJson?.image) {
        src = tokenUriJson.image
    } else if (tokenUriJson?.image_url) {
        src = tokenUriJson.image_url
    }

    if (src?.startsWith("ipfs://")) {
        src = "https://ipfs.io/ipfs/" + src.substring(7)
    }

    if (!src && tokenUriJson && tokenUriJson != "Loading") {
        return null
    } else if (!src && (!tokenUriJson || tokenUriJson == "Loading")) {
        return (
            <Box
                mt={5}
                mb={"100px"}
                border={"2px dashed white"}
                borderRadius="full"
                boxSize="200px"
            ></Box>
        )
    } else {
        return (
            <Image
                mt={5}
                borderRadius="full"
                boxSize="200px"
                objectFit="cover"
                alt="NFT Image"
                src={src}
            />
        )
    }
}
