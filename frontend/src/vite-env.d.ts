/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string;
  readonly VITE_NETWORK: string;
  readonly VITE_IPFS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
