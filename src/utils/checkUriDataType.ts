export async function checkUriDataType(response: any) {
    const data = await response.json()

    if (data?.contents.startsWith("data:binary/octet-stream;base64")) {
        // If data is a binary response, convert it to json
        const base64 = data.contents.split(",")[1]
        const string = Buffer.from(base64, "base64").toString("utf8")
        return await JSON.parse(string)
    } else {
        // try to parse it as json
        let result: any
        try {
            result = await JSON.parse(data.contents)
        } catch (e) {
            // if it fails, return the raw data
            result = "NFT data format not supported yet: " + data.contents
        }
        return result
    }
}
