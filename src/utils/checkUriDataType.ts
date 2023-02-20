export async function checkUriDataType(response: any) {
    const data = await response.json()

    if (data?.contents.startsWith("data:binary/octet-stream;base64")) {
        // If data is a binary response, convert it to json
        const base64 = data.contents.split(",")[1]
        const string = Buffer.from(base64, "base64").toString("utf8")
        return await JSON.parse(string)
    } else if (data?.status.content_type.startsWith("application/json;")) {
        // If data is a json response, return it
        return await JSON.parse(data.contents)
    } else {
        return "NFT data format not supported yet: " + data.contents
    }
}
