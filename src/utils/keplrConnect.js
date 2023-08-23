import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "cosmwasm";

export const USE_TESTNET = false;

const junoMainnetConfig = {
  chainId: "juno-1",
  rpcEndpoint: "https://rpc-juno.mib.tech:443",
  prefix: "juno",
  gasPrice: GasPrice.fromString("0.003ujuno"),
  feeToken: "ujuno",
};

const junoTestConfig = {
  chainId: "uni-5",
  rpcEndpoint: "https://juno-uni-5.mib.tech:443",
  prefix: "juno",
  gasPrice: GasPrice.fromString("0.03ujunox"),
  feeToken: "ujunox",
};

export const junoConfig = junoMainnetConfig;

export const keplrChainInfo = {
  chainId: "uni-5",
  chainName: "Juno Uni",
  rpc: "https://juno-uni-5.mib.tech",
  rest: "https://lcd.uni.juno.deuslabs.fi:443",
  stakeCurrency: {
    coinDenom: "JUNOX",
    coinMinimalDenom: "ujunox",
    coinDecimals: 6,
  },
  bip44: { coinType: 118 },
  bech32Config: {
    bech32PrefixAccAddr: "juno",
    bech32PrefixAccPub: "junopub",
    bech32PrefixValAddr: "junovaloper",
    bech32PrefixValPub: "junovaloperpub",
    bech32PrefixConsAddr: "junovalcons",
    bech32PrefixConsPub: "junovalconspub",
  },
  feeCurrencies: [
    { coinDenom: "JUNOX", coinMinimalDenom: "ujunox", coinDecimals: 6 },
  ],
  currencies: [
    { coinDenom: "JUNOX", coinMinimalDenom: "ujunox", coinDecimals: 6 },
  ],
  features: ["stargate"],
  gasPriceStep: { low: 0.03, average: 0.05, high: 0.08 },
};

async function setupWebKeplr(config) {
  // check browser compatibility
  if (!window.keplr) {
    throw new Error("Keplr is not supported or installed on this browser!");
  }
  // try to enable keplr with given chainId
  await window.keplr.enable(config.chainId).catch(() => {
    throw new Error("Keplr can't connect to this chainId!");
  });
  const { prefix, gasPrice } = config;
  // Setup signer
  const offlineSigner = await window.getOfflineSignerAuto(config.chainId);
  // Init SigningCosmWasmClient client
  const signingClient = await SigningCosmWasmClient.connectWithSigner(
    config.rpcEndpoint,
    offlineSigner,
    {
      gasPrice,
    }
  );
  return signingClient;
}
export async function getClient() {
  if (!window.keplr) {
    window.keplr = window.leap;
  }
  if (USE_TESTNET) {
    await window.keplr.experimentalSuggestChain(keplrChainInfo);
  }

  return await setupWebKeplr(junoConfig);
}
