export const truncateAddress = (address: string) => {
    if (!address) return "No Account"
    const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/)
    if (!match) return address
    return `${match[1]}…${match[2]}`
}

export const toHex = (num: Number) => {
    const val = Number(num)
    return "0x" + val.toString(16)
}
