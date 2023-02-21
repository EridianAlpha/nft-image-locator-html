export const chainName = (chain, provider) => {
    if (chain?.id === 1) {
        return "Ethereum Mainnet"
    } else if (provider._network.chainId === 5) {
        return "Goerli Testnet"
    } else if (provider._network.chainId === 100) {
        return "Gnosis Chain"
    }
}

export const chainIcon = (chain, provider) => {
    if (chain?.id === 1) {
        return "./EthereumLogo.svg"
    } else if (provider._network.chainId === 5) {
        return "./GoerliLogo.svg"
    } else if (provider._network.chainId === 100) {
        return "./GoerliLogo.svg"
    }
}
