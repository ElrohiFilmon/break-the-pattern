/**
 * TOHI Career Path Engine
 *
 * Generates phased, Addis-specific career blueprints for any goal.
 * Trained on Addis Ababa's real ecosystem: iceaddis, Gebeya, Shega,
 * EthioJobs, iCog Labs, Kazana, Adulis, local Telegram communities,
 * university networks, and the city's transport/budget realities.
 *
 * No external API — fully self-contained.
 */

import type { UserProfile } from '@/app/context/ProfileContext'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Milestone {
  title: string
  description: string
  proof: string
}

export interface AddisResource {
  name: string
  type: 'location' | 'community' | 'event' | 'program' | 'platform'
  description: string
  howToAccess: string
}

export interface PatternShift {
  from: string
  to: string
  firstChallenge: string
}

export interface CareerPhase {
  phase: string
  duration: string
  milestones: Milestone[]
  addisResources: AddisResource[]
  patternShifts: PatternShift[]
}

export interface CareerBlueprint {
  title: string
  subtitle: string
  timeline: string
  personalNote: string
  phases: CareerPhase[]
  careerKey: string
}

// ─── Transport helper ─────────────────────────────────────────────────────────

function transportNote(destination: string, profile: UserProfile): string {
  if (profile.transport?.includes('Own vehicle')) return `Drive to ${destination}`
  if (profile.transport?.includes('Ride / Feres regularly')) return `Ride/Feres to ${destination} (~80–150 birr)`
  const area = profile.liveArea || 'your area'
  return `Minibus from ${area} to ${destination} (10–25 birr)`
}

// ─── Career keyword matcher ───────────────────────────────────────────────────

type CareerKey =
  | 'software_developer'
  | 'designer'
  | 'entrepreneur'
  | 'marketer'
  | 'data_analyst'
  | 'content_creator'
  | 'finance'
  | 'general'

export function matchCareer(input: string): CareerKey {
  const lower = input.toLowerCase()
  if (/\b(code|coding|developer|software|programmer|frontend|backend|fullstack|web dev|react|python|javascript)\b/.test(lower)) return 'software_developer'
  if (/\b(design|designer|ui|ux|figma|graphic|product design|visual)\b/.test(lower)) return 'designer'
  if (/\b(entrepreneur|startup|business|found|company|product|launch|venture|mvp)\b/.test(lower)) return 'entrepreneur'
  if (/\b(market|marketing|brand|growth|ads|social media|content strategy|seo|digital market)\b/.test(lower)) return 'marketer'
  if (/\b(data|analyst|analytics|excel|sql|tableau|power bi|machine learning|statistics)\b/.test(lower)) return 'data_analyst'
  if (/\b(content|creator|youtube|podcast|blog|writer|influencer|tiktok|reels|video)\b/.test(lower)) return 'content_creator'
  if (/\b(finance|accounting|investment|bank|fintech|money|cfa|excel model|financial)\b/.test(lower)) return 'finance'
  return 'general'
}

// ─── Blueprint templates ──────────────────────────────────────────────────────

function buildBlueprints(profile: UserProfile): Record<CareerKey, Omit<CareerBlueprint, 'personalNote'>> {
  const area = profile.hangoutArea || profile.liveArea || 'your area'
  const budget = profile.budget || '500–1,500 birr'
  const freeTime = profile.freeTime || '2–4 hours'
  const situation = profile.situation || 'your current situation'

  return {
    software_developer: {
      careerKey: 'software_developer',
      title: 'Software Developer Path',
      subtitle: `From ${situation} to employed developer in Addis`,
      timeline: '6–12 months',
      phases: [
        {
          phase: 'Foundation Building',
          duration: 'Month 1–2',
          milestones: [
            {
              title: 'Master the fundamentals',
              description: 'HTML, CSS, JavaScript — the triad every Addis job listing expects',
              proof: 'Build 3 small projects: a calculator, a to-do list, and a personal landing page',
            },
            {
              title: 'Join the Addis tech community',
              description: 'Your network here matters more than your degree',
              proof: 'Attend 2 events at iceaddis or Gebeya within the first month',
            },
          ],
          addisResources: [
            {
              name: 'iceaddis Innovation Hub',
              type: 'location',
              description: 'Addis\'s premier tech hub — free events, meetups, coworking',
              howToAccess: transportNote('iceaddis, Bole Medhanialem', profile),
            },
            {
              name: 'Gebeya Talent Marketplace',
              type: 'program',
              description: 'Free coding bootcamp with job placement for Ethiopians',
              howToAccess: 'Apply at gebeya.com — rolling admissions, fully free',
            },
            {
              name: 'Addis Software Telegram',
              type: 'community',
              description: '5,000+ Ethiopian developers sharing jobs, code reviews, and resources',
              howToAccess: 'Search "Addis Software" on Telegram and request to join',
            },
          ],
          patternShifts: [
            {
              from: 'Passive tutorial watching',
              to: 'Active project building',
              firstChallenge: `Open VS Code right now. Build the first screen of your calculator app before you sleep tonight. No tutorials — just try.`,
            },
            {
              from: 'Learning alone',
              to: 'Learning in public',
              firstChallenge: 'Post your first project (even if broken) in the Addis Software Telegram group and ask for one piece of feedback.',
            },
          ],
        },
        {
          phase: 'Skill Deepening',
          duration: 'Month 3–5',
          milestones: [
            {
              title: 'Master one framework',
              description: 'React is the most-hired skill in Addis right now',
              proof: 'Build a full CRUD app — expense tracker, note app, or blog',
            },
            {
              title: 'Ship your first paid work',
              description: 'Freelance or contribute to real projects',
              proof: '1 paid project completed, or 5 merged GitHub contributions',
            },
            {
              title: 'Build your portfolio',
              description: 'Your online presence is your CV in Addis tech',
              proof: 'Live portfolio on Vercel with 5 projects and a working contact form',
            },
          ],
          addisResources: [
            {
              name: 'Shega',
              type: 'event',
              description: 'Monthly tech event with hiring managers from top Addis companies',
              howToAccess: 'Follow @ShegaEvents on Telegram and RSVP for the next session',
            },
            {
              name: 'iCog Labs',
              type: 'location',
              description: 'AI research centre — open to collaborators and interns',
              howToAccess: transportNote('iCog Labs, Kazanchis / Arat Kilo area', profile),
            },
            {
              name: 'GitHub + Vercel (free tier)',
              type: 'platform',
              description: 'Your global portfolio lives here — free hosting for all your projects',
              howToAccess: 'Create a GitHub account, deploy every project to Vercel — takes 5 minutes',
            },
          ],
          patternShifts: [
            {
              from: 'Tutorial hell — watching without building',
              to: 'Project-first learning',
              firstChallenge: 'Stop all tutorials now. Pick ONE project idea, write 5 user stories, and start coding it today.',
            },
            {
              from: 'Waiting until code is "ready" to show anyone',
              to: 'Shipping imperfect work',
              firstChallenge: 'Deploy your current half-finished project to Vercel right now. Make it live today even if it has bugs.',
            },
          ],
        },
        {
          phase: 'Job Market Entry',
          duration: 'Month 6–12',
          milestones: [
            {
              title: 'Network with 10 developers',
              description: 'In Addis, referrals beat online applications every time',
              proof: 'Coffee with 5 working developers, 5 follow-up messages sent within 48 hours',
            },
            {
              title: 'Apply with precision',
              description: '20 targeted applications — not 100 generic ones',
              proof: 'Application tracker spreadsheet, every role followed up on',
            },
            {
              title: 'Land your first role',
              description: 'Junior dev, contractor, or freelance-to-hire',
              proof: 'Signed offer or 3-month contract',
            },
          ],
          addisResources: [
            {
              name: 'Gebeya, Adulis Technologies, Kazana Group',
              type: 'location',
              description: 'Addis tech companies actively hiring junior developers right now',
              howToAccess: 'Apply on EthioJobs or walk in with printed portfolio (Gebeya: Bole; Kazana: 22 Mazoria)',
            },
            {
              name: 'Ethiopia Tech Jobs (Telegram)',
              type: 'community',
              description: 'Daily job postings from Addis tech companies — 10,000+ members',
              howToAccess: 'Search "Ethiopia Tech Jobs" on Telegram',
            },
          ],
          patternShifts: [
            {
              from: 'Applying only online and waiting',
              to: 'Showing up in person',
              firstChallenge: `Go to iceaddis or a tech event this week. Talk to 3 developers. Ask each one: "How did you get your first job in Addis?"`,
            },
            {
              from: 'Sending the same CV to everyone',
              to: 'Targeted outreach with a custom project',
              firstChallenge: 'Pick one company you respect. Build a small project inspired by their product. Send it personally with your application.',
            },
          ],
        },
      ],
    },

    designer: {
      careerKey: 'designer',
      title: 'Product Designer Path',
      subtitle: `From ${situation} to hired designer in Addis`,
      timeline: '5–9 months',
      phases: [
        {
          phase: 'Tool Mastery',
          duration: 'Month 1–2',
          milestones: [
            {
              title: 'Learn Figma end-to-end',
              description: 'The only design tool hiring managers in Addis ask for',
              proof: 'Redesign 3 Ethiopian apps (Ride, Enat Bank, Telebirr) from memory',
            },
            {
              title: 'Study UX fundamentals',
              description: 'User research, wireframing, prototyping — the holy trinity',
              proof: 'Complete one end-to-end case study with user interviews',
            },
          ],
          addisResources: [
            {
              name: 'Figma (free education plan)',
              type: 'platform',
              description: 'Free for students — professional-grade UI design tool',
              howToAccess: 'Sign up at figma.com/education with your university email',
            },
            {
              name: 'Netsa Art Village',
              type: 'location',
              description: 'Addis\'s creative hub — designers, artists, and strategists gather here',
              howToAccess: transportNote('Netsa Art Village, Megenagna area', profile),
            },
          ],
          patternShifts: [
            {
              from: 'Consuming design inspiration without making anything',
              to: 'Designing one thing every day',
              firstChallenge: `Open Figma right now and redesign the Telebirr splash screen. Just the one screen. Done by midnight.`,
            },
          ],
        },
        {
          phase: 'Portfolio Building',
          duration: 'Month 3–6',
          milestones: [
            {
              title: '3 case studies in portfolio',
              description: 'Problem → research → wireframe → final design → outcome',
              proof: 'Live Behance or Notion portfolio shared with 5 people who give feedback',
            },
            {
              title: 'First freelance design project',
              description: 'A real client with real constraints teaches more than any course',
              proof: 'Delivered project, payment received, testimonial collected',
            },
          ],
          addisResources: [
            {
              name: 'Addis Ababa Design Community (Telegram)',
              type: 'community',
              description: 'Local designers sharing work, feedback, and freelance leads',
              howToAccess: 'Search "Addis Design" on Telegram',
            },
            {
              name: 'Behance / Notion (portfolio hosting)',
              type: 'platform',
              description: 'Free portfolio hosting — standard for design job applications',
              howToAccess: 'Create account at behance.net or notion.so — free forever',
            },
          ],
          patternShifts: [
            {
              from: 'Perfecting designs forever before sharing',
              to: 'Getting feedback early and often',
              firstChallenge: 'Share your current Figma file with 2 people in the Addis Design Telegram group today and ask for 3 specific critiques.',
            },
          ],
        },
        {
          phase: 'Market Entry',
          duration: 'Month 6–9',
          milestones: [
            {
              title: 'Apply to Addis product companies',
              description: 'Ethiopian startups, NGOs, and banks all need product designers',
              proof: '15 applications sent, 3 portfolio presentations given',
            },
          ],
          addisResources: [
            {
              name: 'EthioJobs, LinkedIn Ethiopia',
              type: 'platform',
              description: 'Primary job boards for design roles in Addis',
              howToAccess: 'Set alerts for "UI designer", "UX designer", "product designer" in Addis',
            },
          ],
          patternShifts: [
            {
              from: 'Applying with a generic portfolio',
              to: 'Applying with a tailored case study',
              firstChallenge: 'Pick one company. Redesign one screen of their product. Send it with your application and explain your thinking.',
            },
          ],
        },
      ],
    },

    entrepreneur: {
      careerKey: 'entrepreneur',
      title: 'Entrepreneur Path',
      subtitle: `From ${situation} to first paying customers in Addis`,
      timeline: '4–8 months',
      phases: [
        {
          phase: 'Idea Validation',
          duration: 'Month 1',
          milestones: [
            {
              title: 'Talk to 20 potential customers',
              description: 'Most Addis entrepreneurs skip this — do not be one of them',
              proof: '20 recorded conversations. At least 5 say they would pay for your solution today.',
            },
            {
              title: 'Define the one problem you solve',
              description: 'One sentence. No jargon. A 14-year-old in Merkato must understand it.',
              proof: 'Problem statement written, tested on 5 strangers, refined',
            },
          ],
          addisResources: [
            {
              name: `Cafés in ${area}`,
              type: 'location',
              description: 'The cheapest customer research venue in Addis — buy someone a macchiato and ask questions',
              howToAccess: `Walk to any café in ${area}. Budget 50 birr per conversation.`,
            },
            {
              name: 'iceaddis Office Hours',
              type: 'event',
              description: 'Free mentorship sessions with experienced Addis entrepreneurs',
              howToAccess: 'Book via iceaddis Telegram or walk in on Tuesdays',
            },
          ],
          patternShifts: [
            {
              from: 'Refining the business plan in private',
              to: 'Talking to real people today',
              firstChallenge: `Today, before you sleep: go to a café in ${area} and ask 3 strangers if they have the problem you want to solve. Listen — do not pitch.`,
            },
          ],
        },
        {
          phase: 'MVP Launch',
          duration: 'Month 2–4',
          milestones: [
            {
              title: 'Build the smallest possible version',
              description: 'Not the dream product — the version that proves the idea works',
              proof: 'MVP live and used by at least 10 people outside your circle',
            },
            {
              title: 'First 3 paying customers',
              description: 'Money is the only real validation',
              proof: '3 receipts. Even 100 birr each counts.',
            },
          ],
          addisResources: [
            {
              name: 'Gebeya Startup Accelerator',
              type: 'program',
              description: '3-month program with mentorship, co-working, and investor connections',
              howToAccess: 'Apply at gebeya.com/startup — next cohort applications open quarterly',
            },
            {
              name: 'Addis Entrepreneurs (Telegram)',
              type: 'community',
              description: 'Founders sharing real stories, not polished pitches — 8,000+ members',
              howToAccess: 'Search "Addis Entrepreneurs" on Telegram',
            },
          ],
          patternShifts: [
            {
              from: 'Building the full product before showing anyone',
              to: 'Selling before building',
              firstChallenge: 'Write a one-page description of your product and send it to 10 potential customers. Ask if they\'d pay for it now. Track every response.',
            },
          ],
        },
        {
          phase: 'Growth & Funding',
          duration: 'Month 5–8',
          milestones: [
            {
              title: 'Reach consistent revenue',
              description: `${budget} monthly revenue — whatever your budget range is, hit it first`,
              proof: 'Revenue tracker spreadsheet showing 3 consecutive months of growth',
            },
            {
              title: 'Enter an accelerator or pitch competition',
              description: 'Addis has more early-stage funding than most founders realise',
              proof: 'Applied to 2 programs, pitched once',
            },
          ],
          addisResources: [
            {
              name: 'Seedstars Ethiopia, Startup Ethiopia',
              type: 'program',
              description: 'Government and international programs funding Addis startups',
              howToAccess: 'Apply at startupethiopia.gov.et or search "Seedstars Ethiopia" online',
            },
          ],
          patternShifts: [
            {
              from: 'Waiting to be "ready" to pitch',
              to: 'Pitching with what you have',
              firstChallenge: 'Record a 2-minute video pitch of your idea on your phone right now. Watch it back. Send it to one mentor for feedback.',
            },
          ],
        },
      ],
    },

    marketer: {
      careerKey: 'marketer',
      title: 'Digital Marketer Path',
      subtitle: `From ${situation} to paid marketing professional in Addis`,
      timeline: '4–7 months',
      phases: [
        {
          phase: 'Core Skill Building',
          duration: 'Month 1–2',
          milestones: [
            {
              title: 'Master Meta Ads and Google Analytics',
              description: 'The two tools every Addis brand manager asks about in interviews',
              proof: 'Run one real campaign (even with 200 birr budget) and document results',
            },
            {
              title: 'Build a content strategy for a local brand',
              description: 'Volunteer for a small Addis business you respect',
              proof: '30-day content calendar delivered and published',
            },
          ],
          addisResources: [
            {
              name: 'Google Digital Garage (free)',
              type: 'platform',
              description: 'Free certified digital marketing courses — globally recognised',
              howToAccess: 'learndigital.withgoogle.com — fully free, takes 40 hours',
            },
            {
              name: 'Ethiopian Digital Marketing Community',
              type: 'community',
              description: 'Addis marketers sharing client leads, tools, and strategy',
              howToAccess: 'Search "Ethiopia Digital Marketing" on Telegram',
            },
          ],
          patternShifts: [
            {
              from: 'Consuming marketing content without practising',
              to: 'Running a real campaign this week',
              firstChallenge: 'Pick a local Addis business. Write 5 Instagram captions for them today. Send it to the owner and offer to manage their page for free for 2 weeks.',
            },
          ],
        },
        {
          phase: 'Portfolio & First Clients',
          duration: 'Month 3–5',
          milestones: [
            {
              title: '2 client case studies with metrics',
              description: 'Results — reach, leads, sales — are your portfolio in marketing',
              proof: 'Documented case study with before/after numbers',
            },
            {
              title: 'First paid marketing project',
              description: 'Any amount. The boundary matters more than the fee.',
              proof: 'Invoice sent and paid',
            },
          ],
          addisResources: [
            {
              name: 'Addis Ababa Chamber of Commerce',
              type: 'location',
              description: 'SMEs looking for affordable marketing help — walk in and introduce yourself',
              howToAccess: transportNote('Addis Chamber, Mexico Square area', profile),
            },
          ],
          patternShifts: [
            {
              from: 'Waiting for perfect portfolio before outreach',
              to: 'Reaching out with what you have today',
              firstChallenge: 'Send 5 cold messages on Telegram or Instagram to Addis businesses today offering a free 2-week trial. Track every response.',
            },
          ],
        },
        {
          phase: 'Full-time Role or Agency',
          duration: 'Month 5–7',
          milestones: [
            {
              title: 'Apply to Addis agencies and brands',
              description: 'Ethiotel, Safaricom, Commercial Bank, and dozens of NGOs hire marketers',
              proof: '10 applications with tailored case studies',
            },
          ],
          addisResources: [
            {
              name: 'EthioJobs, LinkedIn Ethiopia',
              type: 'platform',
              description: 'Primary job listings for marketing roles in Addis',
              howToAccess: 'Set job alerts for "digital marketing", "social media manager", "brand" in Addis',
            },
          ],
          patternShifts: [
            {
              from: 'Generic applications',
              to: 'Campaign audits as cover letters',
              firstChallenge: 'Pick one company. Audit their Instagram — write a 1-page "what I\'d change" note. Send it with your application instead of a cover letter.',
            },
          ],
        },
      ],
    },

    data_analyst: {
      careerKey: 'data_analyst',
      title: 'Data Analyst Path',
      subtitle: `From ${situation} to data professional in Addis`,
      timeline: '5–9 months',
      phases: [
        {
          phase: 'Tools & Foundations',
          duration: 'Month 1–3',
          milestones: [
            {
              title: 'Master Excel, SQL, and one BI tool',
              description: 'Excel is the baseline. SQL gets you interviews. Power BI gets you hired in Addis.',
              proof: 'Complete 3 analysis projects with real datasets (World Bank Ethiopia data is publicly available)',
            },
          ],
          addisResources: [
            {
              name: 'World Bank Open Data (Ethiopia datasets)',
              type: 'platform',
              description: 'Real Ethiopian datasets — population, economy, health — free to analyse',
              howToAccess: 'data.worldbank.org — search "Ethiopia" for hundreds of free datasets',
            },
            {
              name: 'iCog Labs',
              type: 'location',
              description: 'AI/data research community — open to collaborators',
              howToAccess: transportNote('iCog Labs, Arat Kilo area', profile),
            },
          ],
          patternShifts: [
            {
              from: 'Learning tools in isolation with no real project',
              to: 'Analysing real Ethiopian data from day one',
              firstChallenge: 'Download the Ethiopia population dataset from World Bank. Open it in Excel. Find one surprising insight. Write 3 sentences about it.',
            },
          ],
        },
        {
          phase: 'Portfolio & Application',
          duration: 'Month 4–9',
          milestones: [
            {
              title: '3 analysis projects with visualisations',
              description: 'Dashboard in Power BI or Tableau published publicly',
              proof: 'Public GitHub repo with 3 projects, each with README explaining the insight',
            },
            {
              title: 'Apply to data roles in Addis',
              description: 'Commercial Bank, NGOs (USAID, UN), and growing startups all hire analysts',
              proof: '10 applications submitted with portfolio links',
            },
          ],
          addisResources: [
            {
              name: 'USAID Ethiopia, UN Ethiopia',
              type: 'location',
              description: 'Major employers of data analysts — always hiring for M&E roles',
              howToAccess: 'Apply via ReliefWeb or usajobs.gov for USAID postings in Addis',
            },
          ],
          patternShifts: [
            {
              from: 'Waiting to learn one more tool before applying',
              to: 'Applying with current skills and learning while working',
              firstChallenge: 'Apply to 3 data roles today — even if you feel 60% ready. Getting rejected teaches you faster than any course.',
            },
          ],
        },
      ],
    },

    content_creator: {
      careerKey: 'content_creator',
      title: 'Content Creator Path',
      subtitle: `From ${situation} to paid creator in Addis`,
      timeline: '4–8 months',
      phases: [
        {
          phase: 'Niche & Channel Setup',
          duration: 'Month 1–2',
          milestones: [
            {
              title: 'Define your niche and post 20 pieces',
              description: 'Addis audiences respond to authentic, local content — not copied western formats',
              proof: '20 posts published across 8 weeks, engagement tracked in spreadsheet',
            },
          ],
          addisResources: [
            {
              name: 'Fendika Cultural Centre',
              type: 'location',
              description: 'Live music, artists, and performers — great filming location and community',
              howToAccess: transportNote('Fendika Cultural Centre, Kazanchis', profile),
            },
            {
              name: 'Ethiopian Content Creators (Telegram)',
              type: 'community',
              description: 'Addis creators sharing brand deals, tools, and feedback',
              howToAccess: 'Search "Ethiopian Content Creators" on Telegram',
            },
          ],
          patternShifts: [
            {
              from: 'Consuming other creators\' work instead of making your own',
              to: 'Publishing before you feel ready',
              firstChallenge: `Film and post one video today in ${area}. No editing beyond trimming. Just post it. Perfection comes from volume, not planning.`,
            },
          ],
        },
        {
          phase: 'Audience Growth & Monetisation',
          duration: 'Month 3–8',
          milestones: [
            {
              title: 'Reach 1,000 genuine followers',
              description: 'Addis brands start paying at this level for niche audiences',
              proof: 'Public follower count milestone, screenshot saved',
            },
            {
              title: 'Land first brand partnership',
              description: 'Ethiopian brands actively seek local creators — reach out first',
              proof: 'Signed agreement and payment received',
            },
          ],
          addisResources: [
            {
              name: 'Addis Brands (DM on Instagram)',
              type: 'community',
              description: 'Ethiopian SMEs with active Instagram presence who need content creators',
              howToAccess: 'Search Addis-based businesses in your niche on Instagram — send a short pitch DM',
            },
          ],
          patternShifts: [
            {
              from: 'Waiting for big numbers before reaching out to brands',
              to: 'Pitching at 500 followers with a clear niche',
              firstChallenge: 'Write a 3-sentence brand pitch today. Send it to 5 Addis businesses on Instagram. Track every response.',
            },
          ],
        },
      ],
    },

    finance: {
      careerKey: 'finance',
      title: 'Finance Professional Path',
      subtitle: `From ${situation} to finance career in Addis`,
      timeline: '6–12 months',
      phases: [
        {
          phase: 'Certification & Core Skills',
          duration: 'Month 1–4',
          milestones: [
            {
              title: 'Master financial modelling in Excel',
              description: 'Every Addis bank and NGO finance interview involves Excel modelling',
              proof: 'Build 3 financial models: P&L, cash flow, and a DCF valuation',
            },
            {
              title: 'Start CFA Level 1 preparation',
              description: 'CFA is the most recognised finance credential in Addis',
              proof: 'Study schedule created, 100 practice questions completed',
            },
          ],
          addisResources: [
            {
              name: 'Commercial Bank of Ethiopia (CBE) Training Wing',
              type: 'program',
              description: 'CBE regularly hires and trains finance graduates — internship applications open annually',
              howToAccess: 'Apply at cbe.com.et or in person at any CBE branch',
            },
            {
              name: 'Ethiopian Finance Professionals (Telegram)',
              type: 'community',
              description: 'Accountants, analysts, and bankers sharing job leads and exam tips',
              howToAccess: 'Search "Ethiopia Finance Jobs" or "CFA Ethiopia" on Telegram',
            },
          ],
          patternShifts: [
            {
              from: 'Studying theory without building models',
              to: 'Modelling real Ethiopian companies',
              firstChallenge: 'Download the last annual report of Ethio Telecom or CBE. Model their revenue in Excel today. Just 3 rows to start.',
            },
          ],
        },
        {
          phase: 'Internship & First Role',
          duration: 'Month 5–12',
          milestones: [
            {
              title: 'Land an internship or graduate role',
              description: 'Banks, NGOs, and the rapidly growing Ethiopian fintech sector all hire',
              proof: 'Offer letter or internship confirmation',
            },
          ],
          addisResources: [
            {
              name: 'Awash Bank, Dashen Bank, Abyssinia Bank',
              type: 'location',
              description: 'Private banks in Addis growing fastest — more flexible hiring than CBE',
              howToAccess: 'Walk in to any branch with printed CV, or apply via EthioJobs',
            },
          ],
          patternShifts: [
            {
              from: 'Only applying to CBE and big institutions',
              to: 'Targeting fast-growing private banks and fintechs',
              firstChallenge: 'Research 3 private Ethiopian banks this week. Find a contact on LinkedIn. Send one personalised message with your Excel model attached.',
            },
          ],
        },
      ],
    },

    general: {
      careerKey: 'general',
      title: 'Career Transition Path',
      subtitle: `From ${situation} to your next chapter in Addis`,
      timeline: '3–6 months',
      phases: [
        {
          phase: 'Clarity & Direction',
          duration: 'Month 1',
          milestones: [
            {
              title: 'Define your target clearly',
              description: 'Vague goals produce vague results. What specifically do you want?',
              proof: 'Written one-sentence goal: "I want to be doing [X] by [date], earning [amount]"',
            },
            {
              title: 'Research 3 people who already have it',
              description: 'Find 3 people in Addis who are where you want to be and study how they got there',
              proof: 'Three LinkedIn/Telegram profiles documented with notes on their path',
            },
          ],
          addisResources: [
            {
              name: 'iceaddis Open Door Sessions',
              type: 'event',
              description: 'Monthly open days where professionals from all fields share their stories',
              howToAccess: 'Follow iceaddis on Telegram for event dates — usually first Thursday of the month',
            },
            {
              name: `Coffee shops in ${area}`,
              type: 'location',
              description: 'Addis runs on coffee meetings — most professionals will take a 30-minute macchiato conversation',
              howToAccess: `Walk to any café in ${area}. Budget 60 birr and ${freeTime} per session.`,
            },
          ],
          patternShifts: [
            {
              from: 'Waiting for the perfect moment or plan',
              to: 'Taking the smallest possible action today',
              firstChallenge: 'Write your one-sentence goal right now. Then send it to one person who will hold you accountable. Do both before midnight.',
            },
          ],
        },
        {
          phase: 'Action & Momentum',
          duration: 'Month 2–6',
          milestones: [
            {
              title: 'One small action per day toward your goal',
              description: `With ${freeTime} daily, that is enough — consistency beats intensity`,
              proof: '30-day streak tracked in a simple spreadsheet or notebook',
            },
            {
              title: 'Tell 5 people what you want',
              description: 'Addis networks are powerful — someone always knows someone',
              proof: '5 conversations had, at least 1 meaningful connection made',
            },
          ],
          addisResources: [
            {
              name: 'Relevant Telegram communities',
              type: 'community',
              description: 'Every field in Addis has an active Telegram group — find yours',
              howToAccess: 'Search your target field + "Ethiopia" or "Addis" on Telegram',
            },
          ],
          patternShifts: [
            {
              from: 'All planning, no execution',
              to: 'One action before you open your plan again',
              firstChallenge: 'Do the one smallest action toward your goal right now — before reading, planning, or researching anything else.',
            },
          ],
        },
      ],
    },
  }
}

// ─── Personalise blueprint ────────────────────────────────────────────────────

function personalNote(profile: UserProfile, careerKey: CareerKey): string {
  const situation = profile.situation || 'your current situation'
  const area = profile.hangoutArea || profile.liveArea || 'Addis'
  const freeTime = profile.freeTime || '2–4 hours'
  const budget = profile.budget || '500–1,500 birr'

  const careerNames: Record<CareerKey, string> = {
    software_developer: 'software development',
    designer: 'product design',
    entrepreneur: 'entrepreneurship',
    marketer: 'digital marketing',
    data_analyst: 'data analytics',
    content_creator: 'content creation',
    finance: 'finance',
    general: 'this path',
  }

  return `You are ${situation.toLowerCase()} based in ${area}, with ${freeTime} daily and ${budget} monthly. This blueprint is built around your real constraints — every venue, resource, and challenge is chosen to work for your specific situation in Addis.`
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateCareerBlueprint(careerGoal: string, profile: UserProfile): CareerBlueprint {
  const careerKey = matchCareer(careerGoal)
  const templates = buildBlueprints(profile)
  const template = templates[careerKey]

  return {
    ...template,
    personalNote: personalNote(profile, careerKey),
  }
}
