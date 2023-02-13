export const truncateAddress = (address: string, length: string) => {
    if (!address) return "No Account"
    let match: RegExpMatchArray

    if (length === "short") {
        match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/)
    } else if (length === "long") {
        match = address.match(/^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/)
    }
    if (!match) return address
    return `${match[1]}…${match[2]}`
}

export const toHex = (num: Number) => {
    const val = Number(num)
    return "0x" + val.toString(16)
}
