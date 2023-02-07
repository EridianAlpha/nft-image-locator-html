import WalletConnect from "@walletconnect/web3-provider"
import CoinbaseWalletSDK from "@coinbase/wallet-sdk"

export const providerOptions = {
    walletlink: {
        package: CoinbaseWalletSDK, // Required
        options: {
            appName: "Web 3 Modal Demo", // Required
            infuraId: "", // Required unless you provide a JSON RPC url; see `rpc` below
        },
    },
    walletconnect: {
        package: WalletConnect, // required
        options: {
            infuraId: "", // required
        },
    },
}
