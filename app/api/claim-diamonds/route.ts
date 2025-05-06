import { NextRequest } from "next/server";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.ALCHEMY_SEPOLIA_RPC!),
});
const APP_WALLET_ADDRESS = "0x8D0FAC193FEB0017ef573B01E7Acb895D1cb4721";

export async function POST(req: NextRequest) {
  const { txHash, userId } = await req.json();
  if (!txHash || !userId) return new Response(JSON.stringify({ error: "Missing txHash or userId" }), { status: 400 });

  // 1. Get transaction details
  let tx;
  try {
    tx = await client.getTransaction({ hash: txHash });
  } catch {
    return new Response(JSON.stringify({ error: "Transaction not found" }), { status: 404 });
  }
  if (!tx) return new Response(JSON.stringify({ error: "Transaction not found" }), { status: 404 });

  // 2. Validate recipient, amount, and status
  if (tx.to?.toLowerCase() !== APP_WALLET_ADDRESS.toLowerCase()) return new Response(JSON.stringify({ error: "Wrong recipient" }), { status: 400 });
  if (tx.value < BigInt("1000000000000000")) return new Response(JSON.stringify({ error: "Insufficient amount" }), { status: 400 }); // 0.001 ETH
  if (!tx.from) return new Response(JSON.stringify({ error: "No sender" }), { status: 400 });

  // 3. Check if transaction is confirmed
  let receipt;
  try {
    receipt = await client.getTransactionReceipt({ hash: txHash });
  } catch {
    return new Response(JSON.stringify({ error: "Transaction receipt not found" }), { status: 404 });
  }
  if (!receipt || receipt.status !== "success") return new Response(JSON.stringify({ error: "Transaction not confirmed" }), { status: 400 });

  // 4. Credit diamonds to user (simulate for now)
  // TODO: Update your DB to credit 1000 diamonds to userId

  return new Response(JSON.stringify({ success: true }), { status: 200 });
} 