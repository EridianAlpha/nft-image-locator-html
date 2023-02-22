import { checkUriDataType } from "./checkUriDataType"

export async function fetchUriData(_tokenUri: any) {
    console.log("Fetching tokenUri:", _tokenUri)
    let result: any

    for (let i = 0; i < _tokenUri.length; i++) {
        if (_tokenUri[i] && _tokenUri[i].startsWith("http")) {
            // If tokenUri is a standard HTTP URI, fetch it
            result = await fetch(_tokenUri[i])
                .then(async (response) => {
                    if (!response.ok) {
                        return response.statusText
                    } else {
                        return await checkUriDataType(response)
                    }
                })
                .catch(async (error) => {
                    // If http tokenUri is not accessible, try through CORS proxy
                    console.log("error: " + error)
                    console.log("Trying through CORS proxy...")
                    return await fetch(
                        `https://api.allorigins.win/get?url=${encodeURIComponent(_tokenUri[i])}`
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
        } else if (_tokenUri[i] && _tokenUri[i].startsWith("ipfs")) {
            // If tokenUri is an IPFS URI, fetch it
            // return ipfs using ipfs public gateway
            result = await fetch(`https://ipfs.io/ipfs/${_tokenUri[i].substring(7)}`)
                .then(async (response) => {
                    if (!response.ok) {
                        return response.statusText
                    } else {
                        return await response.json()
                    }
                })
                .catch((error) => {
                    console.log("error: " + error)
                })
        } else if (_tokenUri[i] && _tokenUri[i].startsWith("data:application/json;base64,")) {
            // If tokenUri is base64 encoded json, decode it
            const base64 = _tokenUri[i].split(",")[1]
            const string = Buffer.from(base64, "base64").toString("utf8")
            result = await JSON.parse(string)
        } else if (_tokenUri[i] && _tokenUri[i].startsWith("data:application/json,")) {
            // If tokenUri is json, (and is URI encoded), decode it
            const string = _tokenUri[i].split(",")[1]
            result = await JSON.parse(decodeURIComponent(string))
        } else if (_tokenUri[i]) {
            // If tokenUri is not supported, return error
            result = "NFT protocol not supported yet: " + _tokenUri[i]
        }
    }
    return result
}
