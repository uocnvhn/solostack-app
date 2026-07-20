import { Transaction } from "plaid";
import { plaidClient } from "@/lib/plaid/client";

export async function fetchTransactions(accessToken: string): Promise<Transaction[]> {
  const transactions: Transaction[] = [];
  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor,
    });

    transactions.push(...response.data.added);
    hasMore = response.data.has_more;
    cursor = response.data.next_cursor;
  }

  return transactions;
}
