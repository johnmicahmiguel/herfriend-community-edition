import { NextRequest } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const account = privateKeyToAccount(process.env.SEPOLIA_FUNDER_PRIVATE_KEY as `0x${string}`);

const client = createWalletClient({
  account,
  chain: sepolia,
  transport: http(process.env.ALCHEMY_SEPOLIA_RPC!),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, amount } = body;
  if (!to || !amount) {
    return new Response(JSON.stringify({ error: "Missing to or amount" }), { status: 400 });
  }
  try {
    const hash = await client.sendTransaction({
      to,
      value: parseEther(amount),
    });
    return new Response(JSON.stringify({ hash }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
} 