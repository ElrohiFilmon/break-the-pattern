/**
 * TOHI Quick Action Engine
 * Generates personalised blueprints for the 4 quick-action buttons.
 * Fully local — no external API calls.
 */

import type { UserProfile } from '@/app/context/ProfileContext'

// ─── Shared types ─────────────────────────────────────────────────────────────

export type QuickActionId = 'make_friends' | 'learn_skill' | 'new_hobby' | 'discover'

export interface AddisResource {
  name: string
  type: string
  access: string
  cost: string
  bestFor: string
}

export interface WeeklyAction {
  day: string
  action: string
  location: string
  time: string
}

export interface PatternShift {
  from: string
  to: string
  example: string
}

export interface QuickActionBlueprint {
  type: 'quick_action'
  actionId: QuickActionId
  title: string
  subtitle: string
  intro: string
  immediate24hrChallenge: {
    title: string
    challenge: string
    why: string
    proof: string
  }
  weeklyActions: WeeklyAction[]
  monthlyGoal: {
    title: string
    target: string
    milestones: string[]
  }
  addisResources: AddisResource[]
  patternShifts: PatternShift[]
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function area(profile: UserProfile): string {
  return profile.hangoutArea || profile.liveArea || 'Addis'
}

function transportNote(profile: UserProfile, destination: string): string {
  if (profile.transport?.includes('Own vehicle')) return `Drive to ${destination}`
  if (profile.transport?.includes('Ride / Feres regularly')) return `Ride/Feres app to ${destination} (~50–100 birr)`
  if (profile.transport?.includes('Prefer walking distance')) return `Minibus or short walk from ${area(profile)}`
  return `Minibus from ${area(profile)} to ${destination}`
}

function nearestCafe(profile: UserProfile): string {
  const a = area(profile).toLowerCase()
  if (a.includes('bole')) return "Kaldi's Coffee, Bole"
  if (a.includes('piassa') || a.includes('arada')) return 'Tomoca Coffee, Piassa'
  if (a.includes('kazanchis') || a.includes('mexico')) return 'Mokarar Coffee, Kazanchis'
  if (a.includes('megenagna') || a.includes('gerji') || a.includes('cmc')) return 'Netsa Café, Megenagna'
  if (a.includes('sidist kilo') || a.includes('arat kilo')) return 'Unity Park Café, Arat Kilo'
  if (a.includes('yeka')) return 'Shola Market café row, Yeka'
  return 'Tomoca Coffee, Piassa (the original)'
}

// ─── 1. MAKE FRIENDS ─────────────────────────────────────────────────────────

function makeFriendsBlueprint(profile: UserProfile): QuickActionBlueprint {
  const userArea = area(profile)
  const cafe = nearestCafe(profile)
  const interests = profile.interests?.length ? profile.interests : ['your interests']
  const meetingStyle = profile.meetingStyle || ''

  let challenge: string
  if (meetingStyle.includes('One-on-one')) {
    challenge = `Go to ${cafe} today. Start ONE genuine conversation with a stranger or acquaintance. Exchange numbers or Instagram.`
  } else if (meetingStyle.includes('Structured') || meetingStyle.includes('event')) {
    challenge = `Find and RSVP to one event happening this week in Addis (check iceaddis Telegram, Eventbrite, or local WhatsApp groups). Go alone.`
  } else if (meetingStyle.includes('Small group')) {
    challenge = `Text 2–3 acquaintances: "Getting coffee at ${cafe} this week — want to join?" Confirm at least one. Go.`
  } else {
    challenge = `Join one Telegram group for ${interests[0]} in Addis. Introduce yourself and ask one genuine question today.`
  }

  return {
    type: 'quick_action',
    actionId: 'make_friends',
    title: 'Your Friend-Making Blueprint',
    subtitle: `Personalised for ${profile.situation || 'you'} in ${userArea}`,
    intro: `Based on your ${profile.networkSize ? profile.networkSize.toLowerCase() + ' network' : 'current network'} and ${meetingStyle || 'your style'}, here is your path to meaningful connections in Addis.`,
    immediate24hrChallenge: {
      title: 'TODAY: Break the Ice',
      challenge,
      why: "You cannot make friends from your room. This gets you out today.",
      proof: 'Selfie with someone new — or screenshot of a conversation you started',
    },
    weeklyActions: [
      {
        day: 'Day 2–3',
        action: 'Attend one recurring social event in your area (book club, language exchange, gym class)',
        location: userArea + ' — check Telegram for local groups',
        time: profile.freeTime || '2 hours',
      },
      {
        day: 'Day 4–5',
        action: `Follow up with one person you met this week. Suggest ${cafe} for coffee.`,
        location: cafe,
        time: '1 hour',
      },
      {
        day: 'Day 6–7',
        action: 'Host a small gathering: coffee with 2 people you have met. You organise it.',
        location: cafe + ' or your place',
        time: '2–3 hours',
      },
    ],
    monthlyGoal: {
      title: '30-Day Friendship Goal',
      target: 'Have 3 new people you regularly hang out with',
      milestones: [
        '10 new conversations started',
        '5 follow-up meetups completed',
        '3 people who know your name and your story',
        '1 group chat or Telegram group you are active in',
      ],
    },
    addisResources: [
      {
        name: 'iceaddis Community Events',
        type: 'Weekly meetups, workshops, pitch nights',
        access: `Bole area. ${transportNote(profile, 'Bole Medhanialem')}`,
        cost: 'Free',
        bestFor: 'Meeting ambitious creatives and entrepreneurs',
      },
      {
        name: 'Sheger Book Club (Telegram)',
        type: 'Monthly book discussions + in-person meetups',
        access: 'Search "Sheger Book Club" on Telegram — online + cafés',
        cost: 'Free',
        bestFor: 'Intellectual friendships and deep conversations',
      },
      ...(interests.some(i => ['Fitness', 'Health'].includes(i)) ? [{
        name: "Addis Runners (Telegram)",
        type: 'Saturday group runs — all levels welcome',
        access: `Search "Addis Runners". Entoto or Gullele meets. ${transportNote(profile, 'Entoto Park')}`,
        cost: 'Free',
        bestFor: 'Workout buddies and genuine community',
      }] : []),
      ...(interests.some(i => ['Arts', 'Music', 'Film', 'Creative'].includes(i)) ? [{
        name: 'Netsa Art Village / Zoma Museum',
        type: 'Exhibitions, poetry nights, film screenings',
        access: `Netsa: Megenagna. Zoma: Mekanisa. ${transportNote(profile, 'nearest spot')}`,
        cost: 'Free–200 birr',
        bestFor: 'Artists, creatives, and people with curiosity',
      }] : []),
      {
        name: `Regular cafés in ${userArea}`,
        type: 'Coffee culture — becoming a regular',
        access: 'Walk or short minibus ride from home',
        cost: '50–150 birr per visit',
        bestFor: 'Low-pressure, frequent, organic encounters',
      },
    ],
    patternShifts: [
      {
        from: 'Waiting for invitations',
        to: 'Creating the opportunity yourself',
        example: `Instead of hoping someone calls, send: "Coffee at ${cafe} Saturday 3pm? I'll be there."`,
      },
      {
        from: 'Surface-level small talk',
        to: 'Asking real questions',
        example: 'Skip "what do you do?" Try "What are you most excited about right now?" or "What brought you to Addis?"',
      },
      {
        from: 'One-time encounters',
        to: 'Consistent presence',
        example: 'Pick ONE place or event and show up weekly for 4 weeks. Familiarity builds friendships.',
      },
    ],
  }
}

// ─── 2. LEARN A SKILL ────────────────────────────────────────────────────────

function learnSkillBlueprint(profile: UserProfile): QuickActionBlueprint {
  const userArea = area(profile)
  const interests = profile.interests ?? []

  // Skill selection logic
  let skillName: string
  let why: string
  let firstChallenge: string
  let weekActions: WeeklyAction[]
  let monthlyMilestones: string[]
  let resources: AddisResource[]
  let practiceShift: string

  if (interests.includes('Tech') || profile.situation?.includes('Job') || profile.situation?.includes('Student')) {
    skillName = 'Web Development'
    why = 'High demand in Addis — Gebeya, Ethiopian startups, and freelance clients all need it.'
    firstChallenge = 'Build a "Hello World" webpage using HTML + CSS. Deploy it free on Vercel or Netlify. Send the link to one person today.'
    weekActions = [
      { day: 'Day 1–2', action: 'HTML basics — build 3 simple pages', location: 'Home or ' + nearestCafe(profile), time: '2 hrs/day' },
      { day: 'Day 3–4', action: 'CSS styling — make them visually clean', location: 'Home or ' + nearestCafe(profile), time: '2 hrs/day' },
      { day: 'Day 5–7', action: 'JavaScript basics — add one interactive element', location: 'Home or iceaddis coworking', time: '2 hrs/day' },
    ]
    monthlyMilestones = ['Build 3 deployed projects', 'Join Addis Software Telegram (5000+ devs)', 'Apply to Gebeya free bootcamp']
    resources = [
      { name: 'Gebeya Talent Bootcamp', type: 'Free structured program', access: 'Apply online at gebeya.com', cost: 'Free', bestFor: 'Structured path from zero to hired' },
      { name: 'iceaddis Coding Workshops', type: 'Hands-on sessions', access: `Bole area. ${transportNote(profile, 'Bole')}`, cost: 'Free–500 birr', bestFor: 'Accountability and peer learning' },
      { name: 'Addis Software Telegram', type: 'Active developer community', access: 'Search "Addis Software" on Telegram', cost: 'Free', bestFor: 'Mentorship and job leads' },
    ]
    practiceShift = 'Watching a tutorial? Code along at the same time. Never watch passively.'
  } else if (interests.includes('Design') || interests.includes('Creative')) {
    skillName = 'UI/UX Design (Figma)'
    why = 'Every startup in Addis needs designers. Freelance demand is high and tools are free.'
    firstChallenge = 'Redesign one screen of an app you use daily — in Figma (free). Post it on LinkedIn or Telegram today.'
    weekActions = [
      { day: 'Day 1–2', action: 'Learn Figma basics — recreate 3 existing app screens', location: 'Home', time: '2 hrs/day' },
      { day: 'Day 3–4', action: 'Study design principles: spacing, contrast, hierarchy', location: 'Home or café', time: '1.5 hrs/day' },
      { day: 'Day 5–7', action: 'Design your first original mobile app screen from scratch', location: 'iceaddis or home', time: '2 hrs/day' },
    ]
    monthlyMilestones = ['Complete 5 UI projects', 'Get feedback from 3 designers', 'Apply for one freelance gig or internship']
    resources = [
      { name: 'Addis Designers (Telegram)', type: 'Active design community', access: 'Search "Addis Designers"', cost: 'Free', bestFor: 'Feedback, collaboration, job leads' },
      { name: 'iceaddis Design Events', type: 'Monthly workshops and crits', access: `Bole area. ${transportNote(profile, 'Bole')}`, cost: 'Free', bestFor: 'Portfolio feedback from real designers' },
    ]
    practiceShift = 'Do not study "good design" — redesign something badly designed you see every day.'
  } else {
    skillName = 'Digital Marketing'
    why = 'Every business in Addis needs it. Fast results. You can practice on real businesses for free.'
    firstChallenge = 'Pick a local Addis business with no social media. Create a mock Instagram strategy (5 posts + captions). Send it to them as a portfolio piece.'
    weekActions = [
      { day: 'Day 1–2', action: 'Learn Instagram and Facebook basics — audit 5 successful Addis business pages', location: 'Home', time: '1.5 hrs/day' },
      { day: 'Day 3–4', action: 'Create content for a practice account', location: 'Home or café', time: '2 hrs/day' },
      { day: 'Day 5–7', action: 'Run a free campaign for a friend\'s business. Track the numbers.', location: userArea, time: '2 hrs/day' },
    ]
    monthlyMilestones = ['Run 2 real campaigns with measurable results', 'Build a simple portfolio of 3 case studies', 'Land one paid client or internship']
    resources = [
      { name: 'Addis Marketers Telegram', type: 'Local marketing community', access: 'Search "Addis Marketing" or "Addis Digital"', cost: 'Free', bestFor: 'Local context and real campaign examples' },
      { name: 'Local businesses in ' + userArea, type: 'Practice clients (offer free work)', access: 'Walk around your area', cost: 'Free', bestFor: 'Real portfolio and references' },
    ]
    practiceShift = 'Run a real campaign in Week 1 — even unpaid. Theory is worthless without results to point to.'
  }

  return {
    type: 'quick_action',
    actionId: 'learn_skill',
    title: `Master ${skillName}`,
    subtitle: `From zero to competent in ${userArea}`,
    intro: `Based on your interests in ${interests.join(', ') || 'your field'}, ${skillName} is high-impact and fully learnable in Addis without expensive courses.`,
    immediate24hrChallenge: {
      title: 'TODAY: First Contact',
      challenge: firstChallenge,
      why,
      proof: 'Screenshot of your first output — code, design, or campaign draft',
    },
    weeklyActions: weekActions,
    monthlyGoal: {
      title: '30-Day Competence Goal',
      target: `Produce 3 real pieces of work in ${skillName} and show them to someone`,
      milestones: monthlyMilestones,
    },
    addisResources: resources,
    patternShifts: [
      {
        from: 'Learning passively (watching tutorials)',
        to: 'Practicing actively (building things)',
        example: practiceShift,
      },
      {
        from: 'Waiting until you feel ready',
        to: 'Shipping imperfect work',
        example: 'Create something with your new skill in Week 1 — even if it is ugly. Show it to someone.',
      },
      {
        from: 'Learning alone',
        to: 'Learning in a community',
        example: `Find one person in ${userArea} learning the same skill. Study together weekly.`,
      },
    ],
  }
}

// ─── 3. PICK UP A HOBBY ──────────────────────────────────────────────────────

function newHobbyBlueprint(profile: UserProfile): QuickActionBlueprint {
  const userArea = area(profile)
  const interests = profile.interests ?? []

  let hobbyName: string
  let hook: string
  let firstChallenge: string
  let proof: string
  let weekActions: WeeklyAction[]
  let monthlyTarget: string
  let resources: AddisResource[]
  let startNowExample: string

  if (interests.includes('Fitness') || interests.includes('Health')) {
    hobbyName = 'Running / Trail Running'
    hook = 'Addis is the running capital of the world. The trails, the altitude, and the community are all here — you just have not started yet.'
    firstChallenge = `Run 2km today — just around ${userArea}. Track it on your phone (any app works).`
    proof = 'Screenshot of your run tracking — distance and time'
    weekActions = [
      { day: 'Mon / Wed / Fri', action: 'Run 2–3km at an easy pace — no pressure on speed', location: userArea + ' streets or nearest park', time: '30 mins' },
      { day: 'Day 4', action: 'Join Addis Runners Telegram — introduce yourself', location: 'Online', time: '15 mins' },
      { day: 'Weekend', action: 'Do one trail run with the Saturday group at Entoto or Gullele', location: `Entoto Park — ${transportNote(profile, 'Entoto')}`, time: '2–3 hrs' },
    ]
    monthlyTarget = 'Run 50km total and complete one group trail run'
    resources = [
      { name: 'Entoto Park Trails', type: 'Running and hiking trails', access: transportNote(profile, 'Entoto Park'), cost: '20 birr entry', bestFor: 'Altitude training and stunning views' },
      { name: 'Addis Runners (Telegram)', type: 'Weekly group runs — all levels', access: 'Search "Addis Runners" — Saturday mornings', cost: 'Free', bestFor: 'Community, motivation, and safe routes' },
    ]
    startNowExample = 'No running shoes? Wear what you have. Buy proper ones after Week 1 if you stick with it.'
  } else if (interests.includes('Creative') || interests.includes('Arts') || interests.includes('Design')) {
    hobbyName = 'Phone Photography'
    hook = 'Addis is visually extraordinary — old and new, colour and chaos. You already have a camera in your pocket. There is no reason to wait.'
    firstChallenge = `Take 10 photos in ${userArea} today. Post your 3 favourites on Instagram with #AddisStories`
    proof = 'Link to your Instagram post or 3 photos saved to your phone'
    weekActions = [
      { day: 'Daily', action: 'Daily photo challenge — 5 photos per day, different subjects', location: userArea + ' streets, markets, cafés', time: '30 mins' },
      { day: 'Day 3', action: 'Study 3 Ethiopian photographers on Instagram — analyse what makes each shot work', location: 'Online', time: '1 hr' },
      { day: 'Day 5–7', action: 'Learn one technique: composition rule of thirds, or golden hour lighting', location: nearestCafe(profile) + ' area', time: '1–2 hrs' },
    ]
    monthlyTarget = 'Post 30 photos. Get 100+ total likes. Have one person say "can you shoot something for me?"'
    resources = [
      { name: 'Merkato / Shiro Meda / Piassa', type: 'Street photography — endless subjects', access: transportNote(profile, 'Piassa'), cost: 'Free', bestFor: 'Colour, texture, authentic Ethiopian life' },
      { name: 'Addis Photography Community (Telegram)', type: 'Share work, feedback, photo walks', access: 'Search "Addis Photographers"', cost: 'Free', bestFor: 'Improving fast and meeting collaborators' },
    ]
    startNowExample = 'Do not buy a camera. Master your phone camera first. Upgrade only after Month 3 if serious.'
  } else {
    hobbyName = 'Reading'
    hook = 'One book per month, seriously read, compounds into years of advantage. It costs almost nothing in Addis.'
    firstChallenge = 'Go to Bookworld or Nigat Bookstore today and buy or borrow one book. Read 20 pages before bed tonight.'
    proof = 'Photo of you holding the book + the page number you reached'
    weekActions = [
      { day: 'Daily', action: 'Read 30 minutes — morning or just before bed', location: 'Home or a quiet café', time: '30 mins' },
      { day: 'Day 3', action: 'Join Sheger Book Club on Telegram — introduce yourself in the group', location: 'Online', time: '10 mins' },
      { day: 'Weekend', action: 'Visit one bookshop and browse for your next book', location: `Bookworld or Nigat — ${transportNote(profile, 'Bole or Piassa')}`, time: '1 hr' },
    ]
    monthlyTarget = 'Finish 2 books. Recommend one to a friend. Attend one Sheger Book Club session.'
    resources = [
      { name: 'Bookworld / Nigat Bookstore', type: 'Large selection, affordable prices', access: `Multiple locations (Bole, Piassa). ${transportNote(profile, 'nearest branch')}`, cost: '100–400 birr per book', bestFor: 'Finding your next read' },
      { name: 'Sheger Book Club (Telegram)', type: 'Monthly book discussions + in-person meetups', access: 'Search "Sheger Book Club"', cost: 'Free', bestFor: 'Intellectual community and accountability' },
    ]
    startNowExample = 'Cannot afford books? Borrow from a friend or read free e-books (Project Gutenberg, Z-Library). Just start today.'
  }

  return {
    type: 'quick_action',
    actionId: 'new_hobby',
    title: `Start ${hobbyName}`,
    subtitle: 'From zero to genuinely enjoying it — 30 days',
    intro: hook,
    immediate24hrChallenge: {
      title: 'TODAY: Just Start',
      challenge: firstChallenge,
      why: 'Hobbies die in the planning stage. Do it badly today — improve it later.',
      proof,
    },
    weeklyActions: weekActions,
    monthlyGoal: {
      title: '30-Day Goal',
      target: monthlyTarget,
      milestones: [
        'Complete the first challenge today',
        'Show up 3x in Week 1',
        'Find one person in Addis doing the same hobby',
        'Do it together at least once',
      ],
    },
    addisResources: resources,
    patternShifts: [
      {
        from: 'Waiting for perfect conditions or equipment',
        to: 'Starting with exactly what you have today',
        example: startNowExample,
      },
      {
        from: 'Doing it alone, losing motivation',
        to: 'Finding a crew in Addis',
        example: 'Post in a Telegram group: "Anyone in Addis into [hobby]? Want to meet up?" — people always respond.',
      },
    ],
  }
}

// ─── 4. DISCOVER SOMETHING NEW ───────────────────────────────────────────────

function discoverBlueprint(profile: UserProfile): QuickActionBlueprint {
  const userArea = area(profile)

  let firstChallenge: string
  const notDefault = profile.liveArea && profile.liveArea !== 'Addis'
  if (notDefault) {
    firstChallenge = `Go somewhere in Addis you have never been before — NOT in ${profile.liveArea}. Pick from the list below and go today or tomorrow.`
  } else {
    firstChallenge = 'Go to a part of Addis you have never visited. No plan — just show up and walk around for 90 minutes.'
  }

  return {
    type: 'quick_action',
    actionId: 'discover',
    title: 'Your Addis Discovery Challenge',
    subtitle: "Experience something you've never done in this city",
    intro: 'Addis has layers most residents never reach. This week, you will discover one layer at a time.',
    immediate24hrChallenge: {
      title: 'TODAY: Go Somewhere New',
      challenge: firstChallenge,
      why: 'You cannot discover Addis from your routine. This breaks the map you have in your head.',
      proof: 'A photo or selfie from the new place + one sentence: "I did not expect..."',
    },
    weeklyActions: [
      {
        day: 'Day 1',
        action: 'Try a cuisine you have never had in Addis — Korean, Chinese, Italian, or a different Ethiopian region',
        location: 'Korea House (Bole) / Antica Roma (CMC) / Yod Abyssinia (traditional + show)',
        time: '2 hrs',
      },
      {
        day: 'Day 2–3',
        action: 'Attend a cultural event: art exhibition, poetry night, film screening, or live music',
        location: `Zoma Museum (Mekanisa) / Netsa Art Village (Megenagna) / Fendika (Kazanchis)`,
        time: '2–3 hrs',
      },
      {
        day: 'Day 4–5',
        action: 'Explore a market or neighbourhood you have never walked through',
        location: `Merkato (largest market in Africa) / Shiro Meda / Piassa old quarter — ${transportNote(profile, 'Piassa')}`,
        time: '2–3 hrs',
      },
      {
        day: 'Day 6–7',
        action: 'Do something physical and outdoors you have not tried: hiking, cycling, or a public park',
        location: `Entoto Park / Gullele Botanic Garden / Addis Ababa City Forest — ${transportNote(profile, 'Entoto')}`,
        time: '3–4 hrs',
      },
    ],
    monthlyGoal: {
      title: '30-Day Discovery Log',
      target: '12 new experiences — one every 2–3 days',
      milestones: [
        '4 new food/restaurant experiences',
        '3 cultural events attended',
        '3 new neighbourhoods explored',
        '2 outdoor/nature experiences',
        '1 person met who you would never normally encounter',
      ],
    },
    addisResources: [
      {
        name: 'Zoma Museum',
        type: 'Contemporary Ethiopian art + stunning architecture',
        access: `Mekanisa. ${transportNote(profile, 'Mekanisa')}`,
        cost: '100 birr entry',
        bestFor: 'Art, culture, and slow Sunday exploration',
      },
      {
        name: 'Fendika Cultural Center',
        type: 'Traditional Azmari music and dance — live, every night',
        access: `Kazanchis. ${transportNote(profile, 'Kazanchis')}`,
        cost: '100–200 birr',
        bestFor: 'Authentic Ethiopian culture and incredible performances',
      },
      {
        name: 'Merkato',
        type: 'The largest open-air market in Africa',
        access: `${transportNote(profile, 'Merkato')} — go in a group, keep valuables safe`,
        cost: 'Free to enter',
        bestFor: 'Sensory overload in the best possible way',
      },
      {
        name: 'Entoto Park',
        type: 'Hiking, views, and eucalyptus forests',
        access: `${transportNote(profile, 'Entoto')}`,
        cost: '50 birr entry',
        bestFor: 'Perspective — you can see all of Addis from the top',
      },
    ],
    patternShifts: [
      {
        from: 'Knowing Addis only through your daily route',
        to: 'Treating your own city like a traveller would',
        example: 'Next weekend: go somewhere with no plan, no Google Maps, no destination. Just a direction.',
      },
      {
        from: 'Waiting for someone to take you somewhere',
        to: 'Self-initiating exploration',
        example: 'Pick one place from this list and go alone this week. Invite someone after — do not wait for an invitation.',
      },
    ],
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateQuickActionBlueprint(
  actionId: QuickActionId,
  profile: UserProfile | null
): QuickActionBlueprint {
  const safeProfile: UserProfile = profile ?? {
    situation: '',
    liveArea: '',
    hangoutArea: '',
    accessPoints: [],
    freeTime: '',
    budget: '',
    transport: [],
    networkSize: '',
    interests: [],
    meetingStyle: '',
    completedSurvey: false,
  }

  switch (actionId) {
    case 'make_friends': return makeFriendsBlueprint(safeProfile)
    case 'learn_skill':  return learnSkillBlueprint(safeProfile)
    case 'new_hobby':    return newHobbyBlueprint(safeProfile)
    case 'discover':     return discoverBlueprint(safeProfile)
  }
}
