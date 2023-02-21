import { Image } from "@chakra-ui/react"

export default function NftImage({ src }: { src: string }) {
    if (src.startsWith("ipfs://")) {
        src = "https://ipfs.io/ipfs/" + src.substring(7)
    }

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
