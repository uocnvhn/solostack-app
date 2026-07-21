"use server";

import { CountryCode, Products } from "plaid";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { plaidClient } from "@/lib/plaid/client";
import { savePlaidItem } from "@/lib/supabase/plaid-items";

export async function createLinkToken(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Bạn cần đăng nhập.");
  }

  // Toàn bộ quốc gia Plaid hỗ trợ (US + EU) — Plaid không hỗ trợ ngân hàng Việt Nam
  // hay các nước ngoài danh sách này, xem CLAUDE.md.
  const response = await plaidClient.linkTokenCreate({
    client_name: "SoloStack",
    language: "en",
    country_codes: [
      CountryCode.Us,
      CountryCode.Gb,
      CountryCode.Es,
      CountryCode.Nl,
      CountryCode.Fr,
      CountryCode.Ie,
      CountryCode.Ca,
      CountryCode.De,
      CountryCode.It,
      CountryCode.Pl,
      CountryCode.Dk,
      CountryCode.No,
      CountryCode.Se,
      CountryCode.Ee,
      CountryCode.Lt,
      CountryCode.Lv,
      CountryCode.Pt,
      CountryCode.Be,
      CountryCode.At,
      CountryCode.Fi,
    ],
    user: { client_user_id: user.id },
    products: [Products.Transactions],
  });

  return response.data.link_token;
}

export async function exchangePublicToken(
  publicToken: string,
  institutionName: string | null,
): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập." };
  }

  if (!publicToken) {
    return { error: "Thiếu public token từ Plaid Link." };
  }

  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  await savePlaidItem(
    user.id,
    exchangeResponse.data.item_id,
    exchangeResponse.data.access_token,
    institutionName,
  );

  revalidatePath("/");
  return null;
}
