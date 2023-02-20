export const chainName = (chain, provider) => {
    if (chain?.id === 1) {
        return "Ethereum Mainnet"
    } else if (provider._network.chainId === 5) {
        return "Goerli Testnet"
    }
}

export const chainIcon = (chain, provider) => {
    if (chain?.id === 1) {
        return "./EthereumLogo.svg"
    } else if (provider._network.chainId === 5) {
        return "./GoerliLogo.svg"
    }
}
