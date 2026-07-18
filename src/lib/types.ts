export type Subscription = {
  id: string;
  name: string;
  category: string;
  monthlyCost: number;
  renewalDate: string;
  trialEndsAt?: string;
  duplicateGroup?: string;
};
