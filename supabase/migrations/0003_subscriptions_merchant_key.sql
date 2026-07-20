-- merchant_key: định danh giao dịch Plaid đã được đồng bộ thành subscription,
-- dùng để upsert khi đồng bộ lại (tránh tạo trùng dòng). Subscription thêm tay
-- (qua AddSubscriptionForm) không có giá trị này.
alter table subscriptions add column if not exists merchant_key text;

create unique index if not exists subscriptions_user_merchant_key_idx
  on subscriptions(user_id, merchant_key)
  where merchant_key is not null;
