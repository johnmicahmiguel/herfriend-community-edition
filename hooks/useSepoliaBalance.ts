import { useEffect, useState } from "react";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC!),
});

export function useSepoliaBalance(address?: string) {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    let cancelled = false;
    client.getBalance({ address: address as `0x${string}` }).then((bal) => {
      if (!cancelled) setBalance(formatEther(bal));
    });
    return () => { cancelled = true; };
  }, [address]);

  return balance;
} 