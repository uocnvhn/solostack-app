export type Subscription = {
  id: string;
  name: string;
  category: string;
  monthlyCost: number;
  renewalDate: string;
  trialEndsAt?: string;
  duplicateGroup?: string;
};

export const subscriptions: Subscription[] = [
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    monthlyCost: 10,
    renewalDate: "2026-08-01",
  },
  {
    id: "asana",
    name: "Asana",
    category: "Project Management",
    monthlyCost: 13.99,
    renewalDate: "2026-07-25",
    duplicateGroup: "project-management",
  },
  {
    id: "clickup",
    name: "ClickUp",
    category: "Project Management",
    monthlyCost: 12,
    renewalDate: "2026-07-20",
    duplicateGroup: "project-management",
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    monthlyCost: 15,
    renewalDate: "2026-08-05",
  },
  {
    id: "canva",
    name: "Canva Pro",
    category: "Design",
    monthlyCost: 12.99,
    renewalDate: "2026-08-10",
    trialEndsAt: "2026-07-21",
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Communication",
    monthlyCost: 14.99,
    renewalDate: "2026-08-03",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    monthlyCost: 8.75,
    renewalDate: "2026-07-28",
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    category: "Design",
    monthlyCost: 54.99,
    renewalDate: "2026-08-15",
  },
  {
    id: "grammarly",
    name: "Grammarly",
    category: "Writing",
    monthlyCost: 12,
    renewalDate: "2026-08-01",
    trialEndsAt: "2026-07-19",
  },
  {
    id: "hubspot",
    name: "HubSpot CRM",
    category: "Sales",
    monthlyCost: 20,
    renewalDate: "2026-08-20",
    trialEndsAt: "2026-07-30",
  },
];
