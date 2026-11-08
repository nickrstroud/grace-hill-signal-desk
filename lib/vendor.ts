// Everything specific to the vendor this dashboard is framed around: Grace Hill, a technology
// and training company for the multifamily and commercial real estate industries. Name,
// product lineup, how the CS team works, how the agent scores news, and where industry news
// comes from. Prompts, plays, filters, and page copy read from it. This is an independent
// portfolio project, not affiliated with Grace Hill.

export interface Product {
  value: string; // stable id used in companies.json `products`
  label: string;
  description: string; // what it is, for the model
  core?: boolean; // the solution most accounts own: too broad to link an account to routine industry news
}

export const VENDOR = {
  name: "Grace Hill",
  website: "https://gracehill.com/",
  appName: "Grace Hill Account Intelligence Dashboard",
  teamLabel: "Strategic Accounts", // header badge
  role: "strategic accounts team", // footer: "built for a <role> workflow"
  summary: `a technology and training company that provides performance solutions, compliance
education, and operational tools specifically for the multifamily and commercial real estate industries`,
  csMotion: `A new Account Management function owns the commercial outcome for a book of multifamily
owners, operators, and management companies, plus commercial real estate firms. Account Managers
are the commercial owners: they drive renewals, multiyear contracts, and expansion, and they work
with Customer Success on delivery. The largest enterprise accounts get executive-level attention.
The average customer uses about 1.6 of Grace Hill's solutions, so there is wide room to expand.
The job: protect renewals by knowing what is happening at each account before it comes up
(acquisitions, portfolio sales, leadership changes, shopping-score slips, compliance gaps), move
renewals toward multiyear terms, and expand coverage to unowned solutions and to new properties,
regions, or business units. Sales is brought in only for large, high-leverage opportunities that
need major rescoping; the Director, Account Management makes that call.`,
};

// Grace Hill's solution lineup. Each account's `products` lists the ones it already owns.
export const PRODUCTS: Product[] = [
  {
    value: "training",
    label: "Training",
    core: true,
    description:
      "training: a library of 700+ role-based courses for leasing, service, maintenance, and leadership teams, with Learning Plans, Capture Wizard for building custom training, and Sparks microlearning videos",
  },
  {
    value: "policies",
    label: "Policies",
    description:
      "policies: a central hub for company policies and procedures with electronic acknowledgments and an AI assistant (Gracie) so associates can find answers without emailing managers",
  },
  {
    value: "mystery-shopping",
    label: "Mystery Shopping",
    description:
      "mystery shopping: third-party shops of leasing and service interactions with scored results, video and audio recordings, and targeted follow-up training when scores fall short",
  },
  {
    value: "reputation",
    label: "Reputation Mgmt",
    description:
      "reputation management: monitoring and responding to online reviews and resident feedback across properties, to protect rankings and leasing conversion",
  },
  {
    value: "surveys",
    label: "Surveys",
    description:
      "surveys: resident and employee satisfaction and feedback surveys, used to measure experience and direct service and leasing improvements",
  },
  {
    value: "credentials-cec",
    label: "Credentials / CEC",
    description:
      "credentials and continuing education (CEC): tracking industry credentials and required continuing education hours for licensed and certified property staff",
  },
  {
    value: "virtual-tools",
    label: "Virtual Tools",
    description:
      "virtual tools: online leasing and marketing tools for property teams, including Realync video tours (unit-level video that onsite teams film themselves) and interactive resources for leasing teams in the field",
  },
  {
    value: "market-analysis",
    label: "Market Analysis (Hello Data)",
    description:
      "market analysis (Hello Data): market and submarket data, rent and supply analysis, and competitive intelligence for pricing, acquisitions, and investment decisions",
  },
];

// Whether an industry signal is about something this account owns. The core
// solution only counts for act-this-week items, other products from relevance 2.
export function industryTouchesOwned(owned: string[] | undefined, signal: { products: string[]; relevance: number }): boolean {
  return signal.products.some((v) => {
    if (!owned?.includes(v)) return false;
    const core = PRODUCTS.find((p) => p.value === v)?.core;
    return core ? signal.relevance >= 3 : signal.relevance >= 2;
  });
}

// The mirror image: an industry signal on a product the account doesn't own yet.
export function industryTouchesWhitespace(owned: string[] | undefined, signal: { products: string[]; relevance: number }): boolean {
  return signal.products.some((v) => {
    if (owned?.includes(v)) return false;
    const core = PRODUCTS.find((p) => p.value === v)?.core;
    return core ? signal.relevance >= 3 : signal.relevance >= 2;
  });
}

export function productLabel(value: string): string {
  return PRODUCTS.find((p) => p.value === value)?.label ?? value;
}

// How the account agent scores one customer's news. Each line: event -> score (play).
export const ACCOUNT_RUBRIC = `- Acquires a portfolio or property, or launches a new region, property, or business line -> +2
  (onboard the new properties to Training and Policies; Mystery Shopping coverage)
- Lease-up, new community openings, or new office/regional expansion -> +1/+2
  (Training for new teams; Mystery Shopping for new properties)
- Strong earnings, record occupancy or leasing, or raised guidance -> +1 (budget to expand)
- Fair housing complaint, lawsuit, regulatory action, or compliance violation -> +1 for Policies
  and Training (compliance remediation); keep the tone supportive, not opportunistic
- Rent-control, tenant-protection, or labor-law change affecting their markets -> +1 (Policies
  updates; Training on the new rules)
- Negative reviews, shopping-score declines, or resident-satisfaction complaints in the news -> +1
  (Reputation Mgmt, Surveys, Mystery Shopping)
- Digital, AI, or data-platform initiatives announced -> +1 (Market Analysis, Virtual Tools)
- New CEO/COO/VP of Training/HR or Chief Operating leader -> 0 or +1 (re-introduction; new leaders
  review vendors)
- Named sponsor leaving (VP of Training, HR, or Operations) -> -1 (the relationship has to be rebuilt)
- C-level or VP-level executive change at a key account (CEO, COO, CFO, CMO, VP of Operations or Training) -> 0 or +1 for a
  new decision maker to brief on the multiyear plan; -1 if the change looks like a vendor consolidation
- Customer announces a multi-year growth, portfolio, or technology plan -> +1 (the multiyear and expansion conversation)
- Customer adopts or announces AI, property-tech, or data initiatives -> +1 (AI-forward expansion: Market Analysis,
  Virtual Tools, Training on the new tools)
- Portfolio sale, divestiture, or being acquired -> -2 (seats leaving; consolidation risk)
- Layoffs, property sales, restructuring, or bankruptcy -> -1/-2
- A competing platform (for example Yardi Aspire or another training or screening vendor) named as a
  new supplier -> -1/-2
- Awards, rankings, "best place to work" recognition -> 0/+1 (advocacy / case-study ask)
- Materiality: judge size relative to the account. One small property opening at a large
  national owner is routine (0 or +1); for a regional owner with a few hundred units it is material.`;

export const EXAMPLE_ACTION = `"Ask their VP of Training whether the newly acquired properties
will be onboarded to PerformanceHQ this quarter, and offer a Policies and Training rollout plan
for the new team"`;

// Industry lane: what to keep.
export const INDUSTRY_SCOPE = `Scope: news that affects multifamily owners, operators, and management
companies and commercial real estate firms (apartment REIT and portfolio M&A, acquisitions and
dispositions, rent and tenant rules, fair housing, labor and wage changes, workforce shortages,
property-management technology and AI adoption, housing supply and market conditions, and
compliance rules). Keep such items even when they do not map to a specific Grace Hill solution:
they are talking points for a customer conversation. Drop generic business news with no
meaningful effect on the sector, and anything promotional or opinion-only.

Primary angle: rental unit management. Favor news about how rental housing is run day to day
(leasing, resident service, maintenance staffing, renewals, rent and fee rules) over capital
markets news. Real estate and CRE news still counts when it changes how a rental operator works.

Strongest reasons to keep an item:
- Rental unit management operations: leasing, resident service, maintenance, and turnover
- Multifamily and CRE portfolio M&A, recapitalizations, and dispositions
- Fair housing, HUD, and tenant-protection rules, and local rent-control ordinances
- Labor, wage, and workforce-shortage changes affecting leasing and service staff
- Compliance and licensing changes that require training or updated policies
- Resident experience, online reviews, and shopping-score trends across the sector
- Property-tech, AI, and data-platform adoption by large operators
- Market supply, rent, and vacancy shifts that change leasing priorities`;

// Industry lane sources. RSS feeds are fetched directly; topic queries go to
// Google News; the Federal Register pulls formal rules from the listed agencies.
export const INDUSTRY_SOURCES = {
  rss: [] as { name: string; url: string }[],
  topicQueries: [
    "rental property management (leasing OR resident OR maintenance) operators",
    "property management company acquires OR merges apartments",
    "multifamily (acquisition OR portfolio OR disposition) apartment REIT",
    "apartment operators leasing staff training OR turnover",
    "fair housing lawsuit OR settlement apartment operator",
    "rent control OR tenant protection ordinance apartments",
    "commercial real estate (acquisition OR recapitalization) portfolio",
    "property management technology AI investment",
    "multifamily occupancy OR rent growth OR supply outlook",
    "apartment reviews resident satisfaction operators",
    "property management layoffs OR restructuring",
  ],
  topicsBlurb: "multifamily and CRE M&A, fair housing and tenant rules, labor, property-tech adoption, and market conditions",
  federalRegister: {
    term: '"fair housing" | "multifamily" | "rental housing" | "tenant" | "commercial real estate"',
    agencies: [
      "housing-and-urban-development-department",
      "consumer-financial-protection-bureau",
      "labor-department",
      "federal-trade-commission",
    ],
  },
  description:
    "Multifamily and commercial real estate news that affects Grace Hill's customers: portfolio M&A, fair housing and tenant rules, labor, property-tech adoption, and market conditions.",
};

// The disclaimer, split in two so the header can show it as a compact two-line note.
export const DISCLAIMER = [
  `Independent portfolio project built by Nick Stroud, not affiliated with Grace Hill. Account list: multifamily and CRE customers from public Grace Hill case studies.`,
  `Public sources only; not affiliated with any company shown. Updates daily via a scheduled Claude agent.`,
] as const;

export const FOOTER = DISCLAIMER.join(" ");
