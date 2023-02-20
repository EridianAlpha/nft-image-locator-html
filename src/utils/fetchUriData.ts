import { checkUriDataType } from "./checkUriDataType"

export async function fetchUriData(_tokenUri: any) {
    if (_tokenUri.startsWith("http")) {
        return await fetch(_tokenUri)
            .then(async (response) => {
                if (!response.ok) {
                    return response.statusText
                } else {
                    return await checkUriDataType(response)
                }
            })
            .catch(async (error) => {
                console.log("error: " + error)
                console.log("Trying through CORS proxy...")
                return await fetch(
                    `https://api.allorigins.win/get?url=${encodeURIComponent(_tokenUri)}`
                )
                    .then(async (response) => {
                        if (!response.ok) {
                            return response.statusText
                        } else {
                            return await checkUriDataType(response)
                        }
                    })
                    .catch((error) => {
                        console.log("error: " + error)
                    })
            })
    } else if (_tokenUri.startsWith("ipfs")) {
        return "IFPS not supported yet"
    } else {
        return "NFT protocol not supported yet: " + _tokenUri
    }
}
