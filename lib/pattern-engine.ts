/**
 * TOHI PatternBreaker — Local Expert System
 *
 * A fully self-contained pattern analysis engine trained on:
 *   • Behavioral psychology: habit loop theory (Duhigg), motivational interviewing,
 *     implementation intentions, cognitive behavioral coaching
 *   • Addis Ababa socioeconomic & cultural context: youth unemployment, habesha
 *     social dynamics, coffee ceremony culture, minibus transport, tech scene,
 *     creative economy, neighborhood identity, Ethiopian values
 *   • Pattern interruption science: behavioral activation, temptation bundling,
 *     commitment devices, social accountability triggers
 *
 * No API key, no external service — runs entirely on the server.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionStep {
  step: number
  action: string
  location: string
  transport: string
  time: string
}

export interface PatternBreakResult {
  patternName: string
  patternDescription: string
  whyItRepeats: string
  challenge: string
  actionPlan: ActionStep[]
}

// Alias used by UI components
export type PatternBreak = PatternBreakResult

// ─── Addis Ababa venue database ───────────────────────────────────────────────

const VENUES = {
  tech: {
    name: 'iceaddis Innovation Hub',
    neighborhood: 'Bole, near Bole Medhanialem',
    transport: 'Take a blue-white minibus to Bole from Meskel Square (20 birr), ask for "Bole Medhanialem"',
  },
  gebeya: {
    name: 'Gebeya Tech Platform office',
    neighborhood: 'Bole Road',
    transport: 'Minibus to Bole (20 birr) from Meskel Square, then short walk along Bole Road',
  },
  coffee_piassa: {
    name: 'Tomoca Coffee',
    neighborhood: 'Piassa, Churchill Avenue',
    transport: 'Minibus to Piassa (15 birr), ask for "Piassa Medhanialem" — Tomoca is on Churchill',
  },
  coffee_bole: {
    name: "Kaldi's Coffee",
    neighborhood: 'Bole',
    transport: 'Minibus to Bole (20 birr) from Meskel Square, branch is near Edna Mall',
  },
  coffee_arada: {
    name: 'Yeshi Buna',
    neighborhood: 'Arada/Piassa',
    transport: 'Minibus to Piassa (15 birr), walk toward Arada — authentic buna ceremony space',
  },
  mall: {
    name: 'Edna Mall',
    neighborhood: 'Bole',
    transport: 'Minibus to Bole (20 birr) from Meskel Square, ask for "Edna Mall"',
  },
  university: {
    name: 'Addis Ababa University main campus',
    neighborhood: 'Churchill Avenue, Sidist Kilo',
    transport: 'Minibus to Sidist Kilo (15 birr), main gate is on Churchill Avenue',
  },
  entoto: {
    name: 'Entoto Park',
    neighborhood: 'Entoto Mountain, north Addis',
    transport: 'Share taxi from Arat Kilo (~50 birr) or minibus to Entoto Junction (20 birr) then walk up',
  },
  unity: {
    name: 'Unity Park',
    neighborhood: 'Arat Kilo',
    transport: 'Minibus to Arat Kilo (15 birr), park entrance is beside the National Palace',
  },
  merkato: {
    name: 'Merkato',
    neighborhood: 'Addis Ketema',
    transport: "Minibus to Merkato (15 birr) from Meskel Square, ask for \"Merkato\" — Africa's largest open-air market",
  },
  national_theatre: {
    name: 'National Theatre',
    neighborhood: 'Piassa',
    transport: 'Minibus to Piassa (15 birr), the theatre is on Churchill Avenue across from the post office',
  },
  kazanchis: {
    name: 'Kazanchis strip',
    neighborhood: 'Kazanchis, Addis Ketema/Bole border',
    transport: 'Minibus toward Bole (18 birr) from Meskel Square, get off at Kazanchis',
  },
  fendika: {
    name: 'Fendika Cultural Center',
    neighborhood: 'Bole',
    transport: 'Minibus to Bole (20 birr), Fendika is near Bole sub-city — authentic azmari venue',
  },
  a2sv: {
    name: 'A2SV (Africa to Silicon Valley) at AAU',
    neighborhood: 'AAU Campus, Sidist Kilo',
    transport: 'Minibus to Sidist Kilo (15 birr), ask for "University" — A2SV is inside the engineering block',
  },
  ghion: {
    name: 'Ghion Hotel Gardens',
    neighborhood: 'Kirkos',
    transport: 'Minibus to Meskel Square (central), then short walk to Kirkos — gardens are open and calm',
  },
  startup_hub: {
    name: 'Addis Startup Hub',
    neighborhood: 'Bole',
    transport: 'Minibus to Bole (20 birr), check their Telegram channel for exact directions and open hours',
  },
  shola: {
    name: 'Shola Market',
    neighborhood: 'Yeka',
    transport: 'Minibus toward CMC or Yeka (18 birr) from Meskel Square, ask for "Shola"',
  },
  netsa: {
    name: 'Netsa Art Village',
    neighborhood: 'Bole/Megenagna area',
    transport: 'Minibus to Megenagna (20 birr), Netsa is a short walk — open-air alternative arts space',
  },
}

// ─── Pattern archetypes: the "trained" knowledge base ────────────────────────
//
// Each archetype encodes:
//   • trigger_keywords: what the user's text contains
//   • patternName: memorable 3–6 word sticky label
//   • patternDescription: warm, non-judgmental one-liner
//   • psychRoot: the habit loop's hidden reward (why the brain keeps choosing this)
//   • addisAmplifier: how Addis Ababa culture specifically reinforces this loop
//   • challenge: specific 24-hour disruption at a real Addis venue
//   • steps: 3 sequenced actions at real Addis locations (escalating social intensity)
//

const PATTERN_ARCHETYPES: Array<{
  trigger_keywords: string[]
  patternName: string
  patternDescription: string
  psychRoot: string
  addisAmplifier: string
  challenge: string
  steps: ActionStep[]
}> = [
  // ─── 1. Procrastination / YouTube / distraction loops
  {
    trigger_keywords: ['youtube', 'netflix', 'tiktok', 'phone', 'scroll', 'distract', 'procrastinat', 'delay', 'later', 'tomorrow', 'next week', 'never start', 'keep saying', 'avoid'],
    patternName: 'The Infinite Scroll Postponement',
    patternDescription: 'You have a real idea that excites you, but the moment you open your device, two hours disappear and the idea stays locked inside your head.',
    psychRoot: 'Your brain has learned that starting a real project carries the risk of failure — it might not be as good as you imagine. YouTube delivers instant reward with zero risk of judgment. The hidden payoff is staying "the person with the great idea" rather than "the person who tried and might have failed." This is called the planning fallacy combined with present bias — your brain overweights the discomfort of starting and underweights the cost of another day lost.',
    addisAmplifier: 'In Addis, ሀፍረት (the fear of public embarrassment) makes this worse. If you tell your family you are working on something and it fails, you carry the shame. So your brain makes the "rational" choice to never tell anyone, never start publicly, and keep the idea safe. The city\'s tight social circles — where everyone knows everyone through church, school, or neighborhood — raise the stakes of visible failure.',
    challenge: 'Today before 6PM, go to Tomoca Coffee in Piassa (Churchill Avenue, 15 birr by minibus), order one macchiato (10 birr), open a physical notebook — not your phone — and write down exactly one decision you have been avoiding. Then text one person in your phone right now and tell them what you decided. The coffee ceremony there has been closing deals in Addis for 80 years. Let it work for you.',
    steps: [
      {
        step: 1,
        action: 'Leave your home and go to Tomoca Coffee in Piassa. Order one macchiato, keep your phone face-down. In a physical notebook, write the one task you have been avoiding for more than a week. Write exactly what "done" looks like — one sentence.',
        location: 'Tomoca Coffee, Piassa, Churchill Avenue',
        transport: 'Minibus to Piassa (15 birr), ask for "Piassa Medhanialem" — Tomoca is on Churchill Avenue opposite the post office',
        time: '45 minutes',
      },
      {
        step: 2,
        action: 'Go directly to Addis Ababa University campus (Sidist Kilo). Sit in the main quad or under the trees. Use the campus wifi to open your project file or a blank Google Doc. Work on the single task from Step 1 for exactly 90 minutes — no switching tabs. The campus energy of students who are actively building their futures is not accidental.',
        location: 'Addis Ababa University main campus, Churchill Avenue, Sidist Kilo',
        transport: 'Minibus from Piassa to Sidist Kilo (15 birr), main gate is walking distance from Tomoca',
        time: '90 minutes of focused work',
      },
      {
        step: 3,
        action: 'Walk to iceaddis Innovation Hub in Bole. Look at the notice board or ask at the front desk for the next public event or open session. Introduce yourself to one stranger there as "someone working on [your project]." This makes it real. The act of saying it out loud to a person in a real place is the commitment device that breaks the loop.',
        location: 'iceaddis Innovation Hub, Bole, near Bole Medhanialem',
        transport: 'Minibus from Sidist Kilo toward Bole (20 birr), ask for "Bole Medhanialem"',
        time: '30 minutes',
      },
    ],
  },

  // ─── 2. Job search / career stagnation
  {
    trigger_keywords: ['job', 'work', 'employ', 'career', 'cv', 'resume', 'apply', 'interview', 'hire', 'unemployed', 'no opportunity', 'stuck professionally', 'no connections', 'networking'],
    patternName: 'The Invisible Job Seeker Loop',
    patternDescription: 'You are qualified, you are capable, but somehow every opportunity goes to someone else — and your response is to update your CV one more time instead of being seen by the people who matter.',
    psychRoot: 'Updating your CV gives your brain the sensation of progress without the vulnerability of rejection. It is a "preparation ritual" that becomes its own loop. The real reward is avoiding the moment when someone might say no. Behavioral psychology calls this "substitution behavior" — your brain replaces the high-risk action (being seen, reaching out) with a low-risk simulation of it (improving your documents). After enough cycles, the CV becomes perfect and the opportunity stays zero.',
    addisAmplifier: 'Addis job culture runs heavily on networks — ዝምድና (connections, relations). When you see others getting opportunities, your brain tells you it\'s who they know, not what they know. This is sometimes true, but the conclusion your brain draws — "so connections are the only way in" — leads to paralysis rather than action. The Addis tech and startup scene has genuinely open doors: iceaddis hosts weekly events, Gebeya posts open roles, A2SV recruits publicly. But those doors only open for people who physically walk up to them.',
    challenge: 'Today, before you touch your CV, go to iceaddis (Bole, 20 birr by minibus). Walk in, tell the person at the front desk what kind of work you are looking for, and ask when their next community event is. Then sign up for it right there. You are not looking for a job today — you are ending your invisibility.',
    steps: [
      {
        step: 1,
        action: 'Go to iceaddis Innovation Hub. This is non-negotiable — you must physically show up, not email or message. Tell one person there what you are looking for. Ask about upcoming events or anyone who works in your target field. Collect one contact: a name and a Telegram handle.',
        location: 'iceaddis Innovation Hub, Bole, near Bole Medhanialem',
        transport: 'Minibus to Bole (20 birr) from Meskel Square, ask for "Bole Medhanialem"',
        time: '45 minutes',
      },
      {
        step: 2,
        action: 'Walk to the Gebeya Tech Platform office on Bole Road. Browse their open roles on their website while sitting there. Apply to exactly one position — not the "perfect" one, just one that fits 70% of your skills. Submit it before you leave the building. Imperfect action beats perfect inaction.',
        location: 'Gebeya Tech Platform, Bole Road',
        transport: 'Short walk from iceaddis along Bole Road',
        time: '60 minutes',
      },
      {
        step: 3,
        action: 'End the day at Kaldi\'s Coffee in Bole. Message the contact from Step 1 on Telegram. Say exactly: "I came to iceaddis today and applied to [company]. Would you be open to a 15-minute coffee to share your experience in this field?" Short, specific, no desperation. Send it before your coffee arrives.',
        location: "Kaldi's Coffee, Bole, near Edna Mall",
        transport: 'Short walk from Gebeya toward Edna Mall — Kaldi\'s is on the main Bole strip',
        time: '30 minutes',
      },
    ],
  },

  // ─── 3. Business idea / entrepreneurship paralysis
  {
    trigger_keywords: ['business', 'idea', 'startup', 'entrepreneur', 'start', 'launch', 'plan', 'product', 'service', 'sell', 'income', 'money', 'side hustle', 'own thing', 'never launched'],
    patternName: 'The Forever Planning Trap',
    patternDescription: 'Your idea is brilliant, your research is thorough, your plan is almost ready — and it has been "almost ready" for longer than you care to admit.',
    psychRoot: 'Planning is the brain\'s way of staying in control. A plan can always be improved; a launched product can fail. The hidden reward of planning is that you get to keep your identity as "the entrepreneur" without facing the market. This is called the planning fallacy crossed with loss aversion: your brain treats the potential embarrassment of a public failure as more costly than another year of inaction. Every round of "just one more thing to fix" is your brain protecting your self-image.',
    addisAmplifier: 'Addis has an extraordinary informal economy — Merkato alone handles billions of birr in daily transactions without a single pitch deck. Real habesha hustle is physical, fast, and iterative. But the young professional class has absorbed a startup-culture myth (from YouTube, LinkedIn, and American shows) that business requires a perfect plan, a brand, and funding. The entrepreneurs at Merkato would laugh at that — they tested the market tomorrow morning with whatever they had in hand.',
    challenge: 'Go to Merkato today (15 birr by minibus). Walk for 30 minutes and find someone selling the category of product or service closest to your idea. Watch them for 10 minutes. Then buy something small from them and ask: "How did you start this business?" Listen carefully. Your MBA is happening in real-time.',
    steps: [
      {
        step: 1,
        action: 'Go to Merkato (Addis Ketema) and spend 30 minutes observing the market segment closest to your idea. Note: What are people buying? What is the most common complaint you overhear? What is missing? Write three observations in a notebook. Do not use your phone for notes — write by hand. This forces you to be present.',
        location: "Merkato, Addis Ketema — Africa's largest open-air market",
        transport: 'Minibus to Merkato (15 birr) from Meskel Square, ask for "Merkato"',
        time: '45 minutes',
      },
      {
        step: 2,
        action: 'Go to iceaddis or Addis Startup Hub in Bole. Find the notice board or event list. Locate the next open "pitch night" or startup meetup. Sign up. Then, using a voice note on your phone, record a 90-second explanation of your idea as if you were pitching it to a stranger on the minibus. This is your first version. It will be imperfect. That is the point.',
        location: 'iceaddis Innovation Hub or Addis Startup Hub, Bole',
        transport: 'Minibus to Bole (20 birr) from Meskel Square',
        time: '60 minutes',
      },
      {
        step: 3,
        action: 'Go to Tomoca Coffee in Piassa. While there, open a WhatsApp message to three people in your phone who would genuinely use your product or service. Send them: "I am testing an idea — can I ask you two questions?" Do not pitch. Just ask. The first customer conversation has a higher ROI than any planning session.',
        location: 'Tomoca Coffee, Piassa, Churchill Avenue',
        transport: 'Minibus to Piassa (15 birr) from Bole, ask for "Piassa"',
        time: '45 minutes',
      },
    ],
  },

  // ─── 4. Social / relationship isolation
  {
    trigger_keywords: ['lonely', 'alone', 'isolated', 'no friends', 'lost friends', 'relationships', 'social', 'people', 'connect', 'community', 'church', 'group', 'belong', 'excluded', 'outsider'],
    patternName: 'The Comfortable Isolation Drift',
    patternDescription: 'You tell yourself you prefer being alone, but underneath that preference is a quiet ache for genuine connection that your current routine never lets you find.',
    psychRoot: 'Social withdrawal is one of the most seductive loops because it removes short-term discomfort while slowly eroding wellbeing. Every avoided social situation teaches your brain that social settings are dangerous — creating a cycle where isolation feels safer each time. The hidden reward is certainty: alone, you know exactly what will happen. With people, you risk rejection, awkwardness, or vulnerability. But the brain is designed for ሕብረት (communal progress) — isolation is a slow tax on your energy and ambition.',
    addisAmplifier: 'Addis Ababa has extraordinary built-in community infrastructure that many young people have stopped using: coffee ceremonies, church fellowships, neighborhood eder groups, university alumni networks. The irony is that the city\'s tightest social circles often feel impenetrable from the outside — so people who are not already "in" pull back. But the Addis creative and tech scene is genuinely welcoming to new faces, especially at events like iceaddis open nights, Netsa Art Village gatherings, or Fendika cultural evenings.',
    challenge: 'Go to Entoto Park this weekend morning (join the hikers already going up — you will see groups forming at the base). Walk near a group, not with them. By the midpoint of the trail, say one sentence out loud to someone: "How far to the top?" That sentence is the only assignment. The rest will happen naturally.',
    steps: [
      {
        step: 1,
        action: 'Go to Entoto Park in the morning (best between 6–9AM on a weekday or weekend). Walk the main trail. The key instruction: walk at a pace where you are near other people, not isolated. When someone passes you or you pass them, make brief eye contact and nod. This is not socializing yet — it is re-training your body that public space is safe.',
        location: 'Entoto Park, Entoto Mountain, north Addis',
        transport: 'Share taxi from Arat Kilo (~50 birr) or minibus to Entoto Junction (20 birr) then walk up',
        time: '90 minutes',
      },
      {
        step: 2,
        action: 'Go to Netsa Art Village (Megenagna area). This is one of Addis\'s most genuinely welcoming community spaces — artists, musicians, and creatives gather here without hierarchies. Walk around, look at the works, and make one comment to an artist or fellow visitor about something you genuinely find interesting. One sentence. Real, not performed.',
        location: 'Netsa Art Village, Bole/Megenagna area',
        transport: 'Minibus to Megenagna (20 birr) from Meskel Square, Netsa is a short walk',
        time: '60 minutes',
      },
      {
        step: 3,
        action: 'Go to Fendika Cultural Center in Bole for an evening azmari session. Fendika is specifically designed for communal enjoyment — the music is participatory, the crowd is warm, and no one goes alone for long. Order a tej (Ethiopian honey wine, ~50 birr), sit at a table, and when the azmari improvises a song about someone in the crowd, applaud generously. That is your entry into the room.',
        location: 'Fendika Cultural Center, Bole',
        transport: 'Minibus to Bole (20 birr) from Meskel Square, check Fendika\'s Telegram for the evening schedule',
        time: '2 hours',
      },
    ],
  },

  // ─── 5. Health / exercise / body stagnation
  {
    trigger_keywords: ['health', 'exercise', 'gym', 'fit', 'weight', 'body', 'diet', 'eat', 'sleep', 'energy', 'tired', 'inactive', 'sedentary', 'walk', 'run', 'sport'],
    patternName: 'The Monday Reset Illusion',
    patternDescription: 'Every Monday is the day everything changes — the new routine, the gym plan, the diet — and every Monday evening you reset the clock to next Monday.',
    psychRoot: 'The "fresh start" effect is real in behavioral science — people are 2x more likely to start habits at temporal landmarks (Monday, New Year, birthday). But when those fresh starts repeatedly fail, the brain starts treating "Monday" as a coping mechanism — the act of planning the new routine delivers enough dopamine to substitute for actually doing it. The loop is: plan → feel briefly good → do nothing → shame → re-plan. The hidden reward is the planning high. The fix is to make the first action so tiny that planning is unnecessary.',
    addisAmplifier: 'Addis sits at 2,355 meters above sea level — the altitude alone makes any movement more demanding on the cardiovascular system than at sea level, which makes the first steps genuinely harder. This physical reality is real, not an excuse. But Entoto Park at 3,000 meters has been hosting daily hikers for decades. The Addis habit of walking everywhere is the oldest fitness infrastructure in the city — most people dramatically undercount the value of their daily minibus-to-destination walk.',
    challenge: 'Right now — not Monday — put on shoes and walk to the nearest open space: Unity Park, a neighborhood park, or just a long block you have never walked. Walk for exactly 20 minutes in one direction, then turn around. No music, no podcast. Just walk and look at the city. That is the whole assignment.',
    steps: [
      {
        step: 1,
        action: 'Go to Unity Park (Arat Kilo) today — not on Monday. Walk two full laps of the inner gardens at any pace. No phone, no music. The park\'s calm, tree-lined paths are free to enter and deliberately paced for reflection. Time yourself: note how long two laps takes. That is your baseline. Write the time in your notes.',
        location: 'Unity Park, Arat Kilo',
        transport: 'Minibus to Arat Kilo (15 birr), park entrance is beside the National Palace compound',
        time: '40 minutes',
      },
      {
        step: 2,
        action: 'Take a minibus to the base of Entoto Mountain and walk uphill for exactly 30 minutes, then turn around. You do not need to reach the top. The altitude challenge is the point — it makes any future exercise at lower elevation feel easier. Note: bring water (buy at any kiosk for 10 birr). The view from even the lower trail resets your relationship with the city.',
        location: 'Entoto Park, Entoto Mountain',
        transport: 'Minibus to Entoto Junction (20 birr) from Arat Kilo or Meskel Square',
        time: '75 minutes',
      },
      {
        step: 3,
        action: 'End the day at Yeshi Buna in Arada. Order a full buna ceremony — the three rounds of coffee (abol, tona, baraka) take about 45 minutes. While you wait, write down one physical goal for the next 7 days — not a whole program, just one thing you will do 3 times. Post it to your close friends story on Telegram or Instagram. Visibility creates accountability.',
        location: 'Yeshi Buna, Arada/Piassa',
        transport: 'Minibus to Piassa (15 birr) from Entoto Junction area',
        time: '50 minutes',
      },
    ],
  },

  // ─── 6. Education / learning / studying paralysis
  {
    trigger_keywords: ['study', 'learn', 'school', 'university', 'course', 'degree', 'exam', 'grade', 'skill', 'read', 'book', 'knowledge', 'education', 'certificate', 'training', 'coding', 'english', 'language'],
    patternName: 'The Permanent Student Delay',
    patternDescription: 'You keep adding things to learn before you feel "ready" — but the readiness never arrives, and the knowledge stays theoretical while the world moves without you.',
    psychRoot: 'Learning has become your comfort zone rather than a launchpad. The brain loves the feeling of absorbing information — it triggers dopamine without the exposure of application. This is "pseudo-progress": you are always preparing, never deploying. In behavioral terms, the cue is "I need to know more," the routine is consuming courses/books, and the reward is temporarily feeling less behind. The real fix is learning in public, with accountability, applied to a real problem — not in isolation.',
    addisAmplifier: 'Ethiopia\'s education system trains people to consume knowledge passively — lectures, note-taking, rote learning — rather than to produce and apply it. This conditioning runs deep. The Addis tech scene breaks this mold: A2SV students at AAU built competitive programming teams that rank globally because they practiced in public with real problems, not private study sessions. The shift from consumer to producer is Addis\'s biggest growth lever.',
    challenge: 'Today, go to A2SV or Addis Ababa University campus. Sit in a public study space — not your bedroom. Open the skill you have been studying and produce something with it in the next 2 hours: write code, draft an essay, make a design. Then show it to one person in that room. Do not ask for feedback yet — just show it exists.',
    steps: [
      {
        step: 1,
        action: 'Go to A2SV at AAU (Africa to Silicon Valley, engineering block, Sidist Kilo campus). Even if you are not enrolled, the campus study spaces are open. Sit in the library or the main study area. Open your course or textbook to the chapter you have been avoiding. Read or work for 90 minutes without switching tasks.',
        location: 'A2SV at Addis Ababa University, AAU Campus, Sidist Kilo',
        transport: 'Minibus to Sidist Kilo (15 birr), ask for "University" — A2SV is inside the engineering block',
        time: '90 minutes',
      },
      {
        step: 2,
        action: 'Go to iceaddis Innovation Hub in Bole. Find the coworking floor or event space. Work on applying what you just studied — not consuming more of it. If you are learning code, write code. If you are learning design, design something. If you are learning English, write a paragraph about why you are here today. One produced output.',
        location: 'iceaddis Innovation Hub, Bole, near Bole Medhanialem',
        transport: 'Minibus from Sidist Kilo to Bole (20 birr)',
        time: '60 minutes',
      },
      {
        step: 3,
        action: 'Go to Kaldi\'s Coffee in Bole. Post your output from Step 2 — the code, the paragraph, the design — to one Telegram group or your Instagram story with the caption: "First attempt at [skill]. Keeping it public keeps me honest." This is a commitment device. The habesha principle of ሀፍረት works in your favor now — having announced it publicly, your brain will not let you quit.',
        location: "Kaldi's Coffee, Bole",
        transport: "Short walk from iceaddis, Kaldi's is near Edna Mall on Bole Road",
        time: '30 minutes',
      },
    ],
  },

  // ─── 7. Financial / money anxiety loops
  {
    trigger_keywords: ['money', 'broke', 'debt', 'save', 'spend', 'financial', 'budget', 'poor', 'rich', 'afford', 'cost', 'birr', 'salary', 'income', 'invest', 'expensive', 'cheap'],
    patternName: 'The Scarcity Paralysis Cycle',
    patternDescription: 'You think about money constantly — but the thinking happens in circles, never converting into a plan, because planning means confronting numbers you are afraid to see.',
    psychRoot: 'Financial anxiety creates a paradox: the topic causes so much stress that the brain avoids it, which prevents the actions that would reduce the stress. This is avoidance conditioning — the more painful a topic, the more the brain postpones engaging with it, and the postponement makes the situation worse, which makes the topic more painful. The loop becomes self-reinforcing. The behavioral fix is structured, time-limited engagement: 60 minutes with real numbers, in a calm public space, with a clear output — not an open-ended spiral.',
    addisAmplifier: 'Ethiopian culture carries complex attitudes about money: discussing finances openly can feel taboo, and comparing wealth is both inevitable (through visible consumption) and uncomfortable to name directly. In Addis, many young people navigate between family financial obligations (contributing to household), personal aspirations (saving for independence), and peer pressure (keeping up with Bole-lifestyle expectations on a Yeka salary). The gap between these three creates a chronic low-level financial panic that rarely converts to action.',
    challenge: 'Go to Ghion Hotel Gardens today (they are calm, open, and free to sit in). Bring a notebook. Write down three numbers: what comes in each month, what goes out each month (approximate), and the single largest expense you have control over. That is all. No solutions today — just seeing the numbers without panic is the first break in the loop.',
    steps: [
      {
        step: 1,
        action: 'Go to Ghion Hotel Gardens (Kirkos). Sit in the garden — it is one of the calmest spots in central Addis. In a notebook, write your three numbers: monthly income (or average), monthly essential expenses (rent, food, transport), monthly non-essential spending. Be honest. No judgment. Just numbers on paper. This is a diagnostic, not a verdict.',
        location: 'Ghion Hotel Gardens, Kirkos',
        transport: 'Minibus to Meskel Square (central), then short walk toward Kirkos — the Ghion gardens are peaceful and historic',
        time: '45 minutes',
      },
      {
        step: 2,
        action: 'Walk to Shola Market (Yeka, 18 birr by minibus). This is one of Addis\'s most grounding local markets — real prices, real people, real Addis. Spend 30 minutes pricing the basic food basket you actually eat each week. The goal is not to be sad — it is to replace vague anxiety about "money" with specific, accurate information about what your life actually costs.',
        location: 'Shola Market, Yeka',
        transport: 'Minibus toward Yeka (18 birr) from Meskel Square, ask for "Shola"',
        time: '40 minutes',
      },
      {
        step: 3,
        action: 'End at Yeshi Buna in Arada for a buna ceremony. While the coffee brews, write one financial goal with a specific date — not "save more" but "by [date], I will have [amount] birr set aside in CBE for [specific purpose]." Then tell someone you trust — send them a Telegram voice note right there. Accountability is the bridge between knowing and doing.',
        location: 'Yeshi Buna, Arada/Piassa',
        transport: 'Minibus to Piassa (15 birr) from Yeka/Shola area',
        time: '50 minutes',
      },
    ],
  },

  // ─── 8. Creative block / artistic stagnation
  {
    trigger_keywords: ['creat', 'art', 'music', 'write', 'design', 'paint', 'draw', 'film', 'photo', 'sing', 'dance', 'perform', 'express', 'block', 'inspiration', 'talent', 'portfolio', 'creative'],
    patternName: 'The Waiting for Inspiration Trap',
    patternDescription: 'You are genuinely talented, and you know it — but you keep waiting for the right moment, the right mood, the right inspiration that always seems to be one day away.',
    psychRoot: 'Inspiration mythology is one of the most damaging creative lies. The brain, especially for people who identify as creative, attaches their self-worth to their output quality. So not creating feels safer than creating something "less than your best." This is called ego-protective avoidance: the fear of producing average work prevents the production of any work. Professional creatives have learned that inspiration follows action — it does not precede it. The ritual of showing up regardless of mood is what separates working artists from talented people who used to make things.',
    addisAmplifier: 'Addis has one of Africa\'s most vital creative economies — Fendika\'s azmari tradition, the National Theatre\'s 60-year legacy, the emerging film scene, the fashion and music industries growing in Bole. But the city\'s creative community is hierarchical in visible ways: established artists are celebrated, emerging ones are invisible until they break through. This makes young creatives afraid to produce publicly before they are "ready." The irony: every established artist in Addis has a story of embarrassing early work that they made anyway.',
    challenge: 'Go to Netsa Art Village today. Spend one hour there without your phone camera — just look, with your own eyes, at the work people are making. Then pick up whatever material is available (pen, scrap paper, anything) and make one thing in 10 minutes. Do not sign it. Leave it there or take it with you — the point is the making, not the product.',
    steps: [
      {
        step: 1,
        action: 'Go to Netsa Art Village (Megenagna area). Spend the first 30 minutes just observing — look at everything without performing interest. Then, in the second 30 minutes, produce one rough version of something in your medium: a sketch, a voice memo of a melody, a paragraph, a photo series of 10 shots. Do not curate. Do not edit. Just make.',
        location: 'Netsa Art Village, Bole/Megenagna area',
        transport: 'Minibus to Megenagna (20 birr), Netsa is a short walk — open creative community space',
        time: '60 minutes',
      },
      {
        step: 2,
        action: 'Go to the National Theatre in Piassa. Check the notice board or ask at the box office what is currently running or in rehearsal. If there is a performance tonight, buy a ticket (prices range from 50–200 birr). If not, sit in the theatre foyer and sketch or write for 45 minutes while absorbing the energy of the place where Ethiopian creative tradition lives. Proximity to mastery is a form of training.',
        location: 'National Theatre, Piassa, Churchill Avenue',
        transport: 'Minibus to Piassa (15 birr) from Megenagna area, theatre is on Churchill Avenue',
        time: '90 minutes',
      },
      {
        step: 3,
        action: 'Go to Fendika Cultural Center for the evening azmari session. Watch how the azmari improvises — live, in real-time, for a live audience, without a script. This is the professional creative in their purest form: making without safety nets. Before you leave, decide on one creative output you will share publicly within 7 days — not perfect, just real. Tell the person next to you. Strangers make better accountability partners than friends because there is less face to save.',
        location: 'Fendika Cultural Center, Bole',
        transport: 'Minibus to Bole (20 birr) from Piassa/Meskel Square — check Fendika\'s Telegram for schedule',
        time: '2 hours',
      },
    ],
  },

  // ─── 9. Comparison / social media / envy loops
  {
    trigger_keywords: ['compare', 'jealous', 'envy', 'everyone else', 'behind', 'successful', 'they are', 'others', 'instagram', 'telegram', 'social media', 'winning', 'losing', 'not good enough', 'why not me', 'less than'],
    patternName: 'The Comparison Quicksand',
    patternDescription: 'You open your phone to check in with the world and come away feeling smaller — and yet you keep checking, each time hoping the feeling will be different.',
    psychRoot: 'Social comparison is hardwired — humans evolved in small groups where knowing your rank relative to peers was survival-critical. Social media hijacks this ancient circuit by providing an infinite, curated feed of other people\'s highlight reels. Your brain cannot distinguish between "this person\'s best moment" and "this person\'s actual life." The result is a chronic feeling of being behind in a race whose finish line keeps moving. The loop: check → compare → feel inadequate → close the app → feel better → check again. The reward is the brief relief of closing the app, which reinforces reopening it.',
    addisAmplifier: 'Addis Ababa\'s tight social networks make comparison more intense — you often know the people you are comparing yourself to. When someone from your high school, church, or neighborhood appears to be thriving on Instagram, the comparison is not abstract: it is "them vs. me, in the same city, starting from the same place." Ethiopian culture also celebrates visible success loudly (new car, travel photos, formal events), making the gap between private reality and public presentation particularly wide.',
    challenge: 'Delete Instagram or Telegram from your phone right now — not forever, just for 48 hours. Then, immediately, before you can think about it, put on shoes and walk to Unity Park (Arat Kilo). Walk for 20 minutes without your phone. Every thought you have during that walk that begins with "they have..." or "I should..." — acknowledge it and let it pass. That is the whole assignment.',
    steps: [
      {
        step: 1,
        action: 'Go to Unity Park (Arat Kilo) with your phone on Do Not Disturb. Walk for 45 minutes. While walking, when a comparison thought appears ("they have...", "I should..."), say out loud — quietly — "that is the comparison loop." Naming the loop out loud is a proven CBT technique that reduces its power. The park\'s calm makes this accessible.',
        location: 'Unity Park, Arat Kilo',
        transport: 'Minibus to Arat Kilo (15 birr), park entrance beside the National Palace',
        time: '45 minutes',
      },
      {
        step: 2,
        action: 'Go to Addis Ababa University campus (Sidist Kilo). Sit in the quad or library. Open a blank document and write for 20 minutes on this exact prompt: "What do I actually want — not what I want to be seen as having, but what I actually want my life to feel like in two years?" Write without stopping. Do not edit. This is a diagnostic exercise, not a manifesto.',
        location: 'Addis Ababa University main campus, Sidist Kilo',
        transport: 'Minibus from Arat Kilo to Sidist Kilo (short, 10 birr)',
        time: '45 minutes',
      },
      {
        step: 3,
        action: 'End at Ghion Hotel Gardens (Kirkos) — one of the few quiet, grounding spots in central Addis. Sit for 30 minutes and read your writing from Step 2. Underline one sentence that feels most true. Take a photo of just that sentence. That is your anchor statement for the next month. Set it as your phone wallpaper before you leave.',
        location: 'Ghion Hotel Gardens, Kirkos',
        transport: 'Minibus to Meskel Square then short walk to Kirkos',
        time: '40 minutes',
      },
    ],
  },

  // ─── 10. Generic / fallback — confident, Addis-specific
  {
    trigger_keywords: [],
    patternName: 'The Comfortable Standstill',
    patternDescription: 'Something in your daily rhythm has become a holding pattern — not painful enough to force change, not satisfying enough to accept as enough.',
    psychRoot: 'The most insidious loops are not the dramatic ones — they are the low-grade routines that feel fine without feeling alive. Your brain has optimized for comfort and predictability, which is exactly what evolution designed it to do. The problem is that comfort and growth occupy different neurological states, and you cannot access one while fully inhabiting the other. The cue is daily routine, the routine is repetition, and the reward is the absence of discomfort. Breaking this requires deliberately introducing productive discomfort — not pain, just unfamiliarity.',
    addisAmplifier: 'Addis is a city of extraordinary contrast: rapid growth and deep tradition, global ambition and neighborhood rootedness. For young people, it is easy to get caught in a suburb of the city\'s energy — observing the momentum without joining it. The city\'s transformation is happening at iceaddis, at Gebeya, at A2SV, at Netsa, at Fendika. But those spaces require physical presence and the willingness to be seen as a beginner.',
    challenge: 'Go somewhere in Addis today that you have never been — not a restaurant, not a mall, but a working space: iceaddis, A2SV, the National Theatre foyer, Netsa Art Village. Stay for one hour. Observe. Talk to one person. Leave. That is the whole pattern interruption.',
    steps: [
      {
        step: 1,
        action: 'Go to iceaddis Innovation Hub in Bole for the first time (or the first time in more than a year). Walk in during open hours. Look at the notice board. Read every poster and flyer. This is not a task — it is an orientation exercise. You are mapping the terrain of what is possible in this city.',
        location: 'iceaddis Innovation Hub, Bole, near Bole Medhanialem',
        transport: 'Minibus to Bole (20 birr) from Meskel Square, ask for "Bole Medhanialem"',
        time: '45 minutes',
      },
      {
        step: 2,
        action: 'Go to Tomoca Coffee in Piassa (Churchill Avenue). Order a macchiato and sit for 45 minutes. In a notebook, write the answer to this question: "What would I be doing today if I were not afraid of [specific thing you are avoiding]?" Write until the answer surprises you. Tomoca has been the venue for Addis\'s serious conversations for 70 years. It can handle yours.',
        location: 'Tomoca Coffee, Piassa, Churchill Avenue',
        transport: 'Minibus to Piassa (15 birr), Tomoca is on Churchill Avenue opposite the main post office',
        time: '45 minutes',
      },
      {
        step: 3,
        action: 'End the day at Entoto Park. Walk up the trail for 30 minutes. At the highest point you reach, turn around and look at the city spread below you. Addis Ababa from above looks exactly like it is: a city in motion, full of possibility, slightly chaotic, completely alive. You are in it. Decide, standing there, one thing you will do differently tomorrow — then write it in your phone notes before you descend.',
        location: 'Entoto Park, Entoto Mountain',
        transport: 'Minibus to Entoto Junction (20 birr) from Piassa or Meskel Square',
        time: '75 minutes',
      },
    ],
  },
]

// ─── Pattern matching engine ──────────────────────────────────────────────────

function scoreArchetype(input: string, keywords: string[]): number {
  const normalized = input.toLowerCase()
  return keywords.reduce((score, kw) => {
    return normalized.includes(kw.toLowerCase()) ? score + 1 : score
  }, 0)
}

function detectPattern(userInput: string): typeof PATTERN_ARCHETYPES[number] {
  let bestMatch = PATTERN_ARCHETYPES[PATTERN_ARCHETYPES.length - 1] // fallback
  let bestScore = 0

  for (const archetype of PATTERN_ARCHETYPES.slice(0, -1)) {
    const score = scoreArchetype(userInput, archetype.trigger_keywords)
    if (score > bestScore) {
      bestScore = score
      bestMatch = archetype
    }
  }

  return bestMatch
}

// ─── Personalisation layer ────────────────────────────────────────────────────
// Extracts salient fragments from user input and weaves them into the output
// to make responses feel specific rather than generic.

function extractContext(input: string): { timeframe: string; intensity: string } {
  const lower = input.toLowerCase()
  const timeframe =
    lower.includes('year') ? 'for years' :
    lower.includes('month') ? 'for months' :
    lower.includes('week') ? 'for weeks' :
    lower.includes('long time') ? 'for a long time' :
    'for a while'
  const intensity =
    lower.includes('really') || lower.includes('badly') || lower.includes('so much') || lower.includes('very') ? 'deeply' :
    lower.includes('kind of') || lower.includes('sort of') || lower.includes('sometimes') ? 'partially' :
    'genuinely'
  return { timeframe, intensity }
}

// ─── Profile personalisation layer ───────────────────────────────────────────

interface ProfileContext {
  situation?: string
  situationDetail?: string
  liveArea?: string
  hangoutArea?: string
  accessPoints?: string[]
  freeTime?: string
  budget?: string
  transport?: string[]
  networkSize?: string
  interests?: string[]
  meetingStyle?: string
}

// Resolve the best venue for a step given the user's area
function resolveVenueForArea(area: string | undefined, defaultVenue: string): string {
  if (!area) return defaultVenue
  const lower = area.toLowerCase()
  if (lower === 'piassa' || lower === 'arada') return 'Tomoca Coffee, Piassa, Churchill Avenue'
  if (lower === 'bole') return "Kaldi's Coffee, Bole, near Edna Mall"
  if (lower === 'kazanchis' || lower === 'mexico') return 'Kazanchis strip cafes, Addis Ketema / Bole border'
  if (lower === 'megenagna' || lower === 'cmc' || lower === 'gerji') return 'Netsa Art Village, Megenagna area'
  if (lower === 'arat kilo' || lower === 'sidist kilo') return 'Unity Park, Arat Kilo'
  if (lower === 'yeka') return 'Shola Market, Yeka'
  if (lower === 'kirkos') return 'Ghion Hotel Gardens, Kirkos'
  return defaultVenue
}

// Resolve transport note based on profile
function resolveTransport(profile: ProfileContext, defaultNote: string): string {
  if (!profile.transport || profile.transport.length === 0) return defaultNote
  if (profile.transport.includes('Own vehicle')) return 'Drive — use Google Maps or Waze'
  if (profile.transport.includes('Ride / Feres regularly')) return 'Use Ride or Feres app (budget 50–100 birr)'
  if (profile.transport.includes('Prefer walking distance')) {
    const area = profile.hangoutArea || profile.liveArea
    return area ? `Walk from your area (${area}) or take a short minibus ride` : defaultNote
  }
  return defaultNote
}

// Build a profile context sentence to prepend to whyItRepeats
function profileContextSentence(profile: ProfileContext): string {
  const parts: string[] = []
  if (profile.situation) {
    const detail = profile.situationDetail ? ` (${profile.situationDetail})` : ''
    parts.push(`As a ${profile.situation.toLowerCase()}${detail} in Addis`)
  }
  if (profile.liveArea || profile.hangoutArea) {
    const area = profile.hangoutArea || profile.liveArea
    parts.push(`based in ${area}`)
  }
  if (profile.networkSize) {
    const ns = profile.networkSize.toLowerCase()
    if (ns === 'very small' || ns === 'small') {
      parts.push('with a small network')
    }
  }
  return parts.length > 0 ? `${parts.join(', ')}, this pattern has a specific texture for you. ` : ''
}

// Personalise action steps with profile data
function personaliseSteps(steps: ActionStep[], profile: ProfileContext): ActionStep[] {
  return steps.map((step) => {
    const area = profile.hangoutArea || profile.liveArea
    const resolvedLocation = resolveVenueForArea(area, step.location)
    const resolvedTransport = resolveTransport(profile, step.transport)

    // Adjust action text for small networks: prefer 1-on-1
    let action = step.action
    if (
      profile.meetingStyle?.includes('One-on-one') &&
      (action.includes('groups') || action.includes('crowd') || action.includes('event'))
    ) {
      action = action + ' If large groups feel overwhelming, start with a single focused 1-on-1 conversation instead.'
    }

    // Adjust for very limited time
    if (profile.freeTime === 'Less than 1 hour') {
      action = action + ' Note: you have limited time today — compress this step to 30 minutes and focus on the single key action only.'
    }

    return {
      ...step,
      action,
      location: resolvedLocation !== step.location ? `${resolvedLocation} (near your area)` : step.location,
      transport: resolvedTransport,
    }
  })
}

// Personalise the challenge text
function personaliseChallenge(challenge: string, profile: ProfileContext): string {
  let c = challenge
  const area = profile.hangoutArea || profile.liveArea
  if (area && !c.includes(area)) {
    c = c + ` If getting across the city is difficult today, find the closest equivalent in ${area} — the location is less important than breaking the habit of not going.`
  }
  if (profile.budget === 'Under 500 birr') {
    c = c + ' All suggested venues and activities cost under 100 birr.'
  }
  return c
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function analyzePattern(userInput: string, profile?: ProfileContext | null): PatternBreakResult {
  const archetype = detectPattern(userInput)
  const { timeframe } = extractContext(userInput)

  const contextSentence = profile ? profileContextSentence(profile) : ''
  const whyItRepeats = `${contextSentence}${archetype.psychRoot} You have been in this loop ${timeframe}. ${archetype.addisAmplifier}`

  const challenge = profile ? personaliseChallenge(archetype.challenge, profile) : archetype.challenge
  const actionPlan = profile ? personaliseSteps(archetype.steps, profile) : archetype.steps

  return {
    patternName: archetype.patternName,
    patternDescription: archetype.patternDescription,
    whyItRepeats,
    challenge,
    actionPlan,
  }
}
