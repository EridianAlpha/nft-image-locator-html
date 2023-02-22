import {
    mainnet,
    goerli,
    arbitrum,
    aurora,
    auroraTestnet,
    avalanche,
    bsc,
    optimism,
    polygon,
    sepolia,
    zkSync,
    zkSyncTestnet,
    gnosis,
} from "wagmi/chains"

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

export const chainList = [
    mainnet,
    goerli,
    arbitrum,
    aurora,
    auroraTestnet,
    avalanche,
    bsc,
    // optimism,
    polygon,
    sepolia,
    zkSync,
    zkSyncTestnet,
    gnosis,
]
