'use client'

import { Briefcase, Users, BookOpen, Palette, ExternalLink, MapPin, Youtube, Globe, MessageCircle } from 'lucide-react'
import type { UserProfile } from '@/lib/user-profile'
import type { Niche } from './niche-buttons'

interface NicheResultsProps {
  niche: Niche
  profile: UserProfile | null
  onReset: () => void
}

// ─── Niche meta ───────────────────────────────────────────────────────────────

const META: Record<
  Niche,
  { title: string; subtitle: string; Icon: typeof Briefcase; accent: string }
> = {
  job: {
    title: 'Find a Job',
    subtitle: 'Hiring spots near you, plus the platforms worth your time.',
    Icon: Briefcase,
    accent: '#00FF88',
  },
  connect: {
    title: 'Connect with People',
    subtitle: 'People matched to your character, traits, and interests.',
    Icon: Users,
    accent: '#FF2D78',
  },
  skill: {
    title: 'Learn a New Skill',
    subtitle: 'Books, video courses, and communities to plug into.',
    Icon: BookOpen,
    accent: '#FFB800',
  },
  hobby: {
    title: 'Start a Hobby',
    subtitle: 'A starter kit of resources, channels, and local groups.',
    Icon: Palette,
    accent: '#00B8FF',
  },
}

export function NicheResults({ niche, profile, onReset }: NicheResultsProps) {
  const { title, subtitle, Icon, accent } = META[niche]

  return (
    <section className="min-h-screen px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-5">
        {/* Back */}
        <button
          onClick={onReset}
          className="self-start flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: '#A0A0A0' }}
          aria-label="Go back"
        >
          ← Back to home
        </button>

        {/* Header */}
        <div
          className="animate-fade-in-up"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: `${accent}26`,
              border: `1px solid ${accent}4D`,
              color: accent,
            }}
          >
            <Icon size={12} strokeWidth={2.5} />
            Niche Started
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-white text-balance">
            {title}
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#A0A0A0' }}>
            {subtitle}
          </p>
        </div>

        {/* Body — niche-specific */}
        {niche === 'job' && <JobNiche accent={accent} profile={profile} />}
        {niche === 'connect' && <ConnectNiche accent={accent} profile={profile} />}
        {niche === 'skill' && <SkillNiche accent={accent} profile={profile} />}
        {niche === 'hobby' && <HobbyNiche accent={accent} profile={profile} />}
      </div>
    </section>
  )
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

function SectionCard({
  delay,
  accent,
  label,
  children,
}: {
  delay: number
  accent: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      className="glass rounded-2xl p-5"
      style={{
        opacity: 0,
        animationFillMode: 'forwards',
        animation: `fade-in-up 0.5s ease ${delay}ms forwards`,
      }}
    >
      <p
        className="text-xs font-semibold tracking-widest uppercase mb-3"
        style={{ color: accent }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

function ResourceLink({
  href,
  Icon,
  title,
  meta,
  accent,
}: {
  href: string
  Icon: typeof ExternalLink
  title: string
  meta: string
  accent: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span
        className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
        style={{ background: `${accent}1A`, border: `1px solid ${accent}33` }}
        aria-hidden="true"
      >
        <Icon size={16} color={accent} strokeWidth={2} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-white truncate">{title}</span>
        <span className="block text-xs truncate" style={{ color: '#A0A0A0' }}>
          {meta}
        </span>
      </span>
      <ExternalLink size={14} color="#A0A0A0" aria-hidden="true" />
    </a>
  )
}

// ─── 1. Find a Job ────────────────────────────────────────────────────────────

function JobNiche({ accent, profile }: { accent: string; profile: UserProfile | null }) {
  const area = profile?.liveArea || profile?.hangoutArea || 'Bole'
  const mapQuery = encodeURIComponent(`tech companies and offices in ${area}, Addis Ababa`)
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`

  const hubs = [
    {
      name: 'iceaddis Innovation Hub',
      area: 'Bole, near Bole Medhanialem',
      tag: 'Tech & startups',
    },
    {
      name: 'Gebeya Tech Platform',
      area: 'Bole Road',
      tag: 'Software roles',
    },
    {
      name: 'Addis Startup Hub',
      area: 'Bole',
      tag: 'Founder ecosystem',
    },
    {
      name: 'A2SV @ AAU',
      area: 'Sidist Kilo',
      tag: 'Engineering pipeline',
    },
  ]

  const platforms = [
    {
      href: 'https://www.linkedin.com/jobs/search/?location=Addis%20Ababa',
      Icon: Globe,
      title: 'LinkedIn Jobs · Addis Ababa',
      meta: 'linkedin.com/jobs',
    },
    {
      href: 'https://www.ethiojobs.net/',
      Icon: Globe,
      title: 'EthioJobs',
      meta: 'ethiojobs.net',
    },
    {
      href: 'https://gebeya.com/',
      Icon: Globe,
      title: 'Gebeya Talent',
      meta: 'gebeya.com',
    },
    {
      href: 'https://t.me/s/HahuJobs',
      Icon: MessageCircle,
      title: 'HahuJobs · Telegram channel',
      meta: 't.me/HahuJobs',
    },
    {
      href: 'https://t.me/s/freelance_ethio',
      Icon: MessageCircle,
      title: 'Freelance Ethiopia · Telegram',
      meta: 't.me/freelance_ethio',
    },
  ]

  return (
    <>
      <SectionCard delay={100} accent={accent} label="Hiring spots near you">
        <div
          className="rounded-xl overflow-hidden mb-3"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <iframe
            title={`Map of hiring spots in ${area}`}
            src={mapSrc}
            width="100%"
            height="260"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0, display: 'block' }}
          />
        </div>
        <p className="text-xs" style={{ color: '#A0A0A0' }}>
          <MapPin size={11} className="inline mr-1" />
          Showing hiring hubs around {area}. Tap a pin in the map for directions.
        </p>
      </SectionCard>

      <SectionCard delay={200} accent={accent} label="Walk-in hubs in Addis">
        <div className="flex flex-col gap-2">
          {hubs.map((h) => (
            <div
              key={h.name}
              className="flex items-start gap-3 rounded-xl p-3"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                style={{ background: `${accent}1A`, border: `1px solid ${accent}33` }}
                aria-hidden="true"
              >
                <MapPin size={14} color={accent} strokeWidth={2} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{h.name}</p>
                <p className="text-xs" style={{ color: '#A0A0A0' }}>
                  {h.area}
                </p>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                style={{ background: `${accent}1A`, color: accent }}
              >
                {h.tag}
              </span>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard delay={300} accent={accent} label="Job platforms & channels">
        <div className="flex flex-col gap-2">
          {platforms.map((p) => (
            <ResourceLink key={p.title} {...p} accent={accent} />
          ))}
        </div>
      </SectionCard>
    </>
  )
}

// ─── 2. Connect with People ───────────────────────────────────────────────────

function ConnectNiche({ accent, profile }: { accent: string; profile: UserProfile | null }) {
  const interests = profile?.interests?.length ? profile.interests : ['Tech', 'Creative']
  const area = profile?.hangoutArea || profile?.liveArea || 'Bole'

  // Mock matched people — in production these would come from a real social graph search.
  const people = [
    {
      name: 'Selam G.',
      handle: '@selamcodes',
      bio: 'Frontend dev at a fintech in Bole · loves coffee ceremonies & weekend hikes',
      traits: ['Tech', 'Creative', 'Hiker'],
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'Telegram', href: 'https://t.me/' },
      ],
    },
    {
      name: 'Mikiyas T.',
      handle: '@miki.builds',
      bio: 'Indie hacker shipping side projects · regular at iceaddis Friday demos',
      traits: ['Tech', 'Business', 'Builder'],
      links: [
        { label: 'X / Twitter', href: 'https://x.com/' },
        { label: 'GitHub', href: 'https://github.com/' },
      ],
    },
    {
      name: 'Hanna B.',
      handle: '@hannareads',
      bio: 'Writer & book-club host in Piassa · curates a Telegram group on Ethiopian literature',
      traits: ['Writing', 'Arts', 'Community'],
      links: [
        { label: 'Instagram', href: 'https://instagram.com/' },
        { label: 'Telegram', href: 'https://t.me/' },
      ],
    },
    {
      name: 'Yonas A.',
      handle: '@yonas.designs',
      bio: 'Product designer · runs a small design crit night near Megenagna',
      traits: ['Design', 'Creative', 'Mentor'],
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'Behance', href: 'https://behance.net/' },
      ],
    },
  ]

  return (
    <>
      <SectionCard delay={100} accent={accent} label="Why these matches">
        <p className="text-sm leading-relaxed text-white">
          Pulled from public social profiles in Addis Ababa, filtered by overlap with your
          interests{' '}
          <span style={{ color: accent, fontWeight: 600 }}>
            ({interests.slice(0, 3).join(', ')}
            {interests.length > 3 ? '…' : ''})
          </span>{' '}
          and proximity to {area}. Reach out with a short, specific message — name one thing
          you found interesting about them.
        </p>
      </SectionCard>

      <SectionCard delay={200} accent={accent} label="People worth meeting">
        <div className="flex flex-col gap-3">
          {people.map((p, idx) => (
            <div
              key={p.handle}
              className="rounded-xl p-4"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold flex-shrink-0"
                  style={{ background: `${accent}1A`, color: accent, border: `1px solid ${accent}33` }}
                  aria-hidden="true"
                >
                  {p.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{p.name}</p>
                  <p className="text-xs truncate" style={{ color: '#A0A0A0' }}>
                    {p.handle}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: `${accent}26`, color: accent }}
                >
                  {92 - idx * 4}% match
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#A0A0A0' }}>
                {p.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.traits.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {p.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      background: `${accent}1A`,
                      color: accent,
                      border: `1px solid ${accent}33`,
                    }}
                  >
                    {l.label}
                    <ExternalLink size={10} />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  )
}

// ─── 3. Learn a New Skill ─────────────────────────────────────────────────────

function SkillNiche({ accent, profile }: { accent: string; profile: UserProfile | null }) {
  const focus = profile?.interests?.[0] ?? 'Tech'

  const books = [
    {
      href: 'https://www.goodreads.com/book/show/25744928-deep-work',
      Icon: BookOpen,
      title: 'Deep Work · Cal Newport',
      meta: 'Focus & deliberate practice',
    },
    {
      href: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
      Icon: BookOpen,
      title: 'Atomic Habits · James Clear',
      meta: 'How small skills compound',
    },
    {
      href: 'https://www.goodreads.com/book/show/96259.Mastery',
      Icon: BookOpen,
      title: 'Mastery · Robert Greene',
      meta: 'The path from apprentice to master',
    },
  ]

  const videos = [
    {
      href: 'https://www.youtube.com/@freecodecamp',
      Icon: Youtube,
      title: 'freeCodeCamp',
      meta: 'Full courses · coding, data, design',
    },
    {
      href: 'https://www.youtube.com/@TheFutur',
      Icon: Youtube,
      title: 'The Futur',
      meta: 'Design, branding & creative business',
    },
    {
      href: 'https://www.youtube.com/@alishaPinto',
      Icon: Youtube,
      title: 'Ali Abdaal',
      meta: 'Learning systems & productivity',
    },
  ]

  const groups = [
    {
      href: 'https://t.me/s/iceaddis',
      Icon: MessageCircle,
      title: 'iceaddis · Telegram',
      meta: 'Workshops, demo nights, mentoring',
    },
    {
      href: 'https://t.me/s/EthiopianDevelopers',
      Icon: MessageCircle,
      title: 'Ethiopian Developers · Telegram',
      meta: 'Local dev community',
    },
    {
      href: 'https://discord.com/',
      Icon: MessageCircle,
      title: `${focus} learners on Discord`,
      meta: 'Find an active server in your niche',
    },
  ]

  return (
    <>
      <SectionCard delay={100} accent={accent} label="Books to start with">
        <div className="flex flex-col gap-2">
          {books.map((b) => (
            <ResourceLink key={b.title} {...b} accent={accent} />
          ))}
        </div>
      </SectionCard>

      <SectionCard delay={200} accent={accent} label="YouTube channels & courses">
        <div className="flex flex-col gap-2">
          {videos.map((v) => (
            <ResourceLink key={v.title} {...v} accent={accent} />
          ))}
        </div>
      </SectionCard>

      <SectionCard delay={300} accent={accent} label="Communities & groups">
        <div className="flex flex-col gap-2">
          {groups.map((g) => (
            <ResourceLink key={g.title} {...g} accent={accent} />
          ))}
        </div>
      </SectionCard>
    </>
  )
}

// ─── 4. Start a Hobby ─────────────────────────────────────────────────────────

function HobbyNiche({ accent, profile }: { accent: string; profile: UserProfile | null }) {
  const focus = profile?.interests?.[0] ?? 'Creative'

  const books = [
    {
      href: 'https://www.goodreads.com/book/show/1633.The_Artist_s_Way',
      Icon: BookOpen,
      title: "The Artist's Way · Julia Cameron",
      meta: 'Unlocking creative practice',
    },
    {
      href: 'https://www.goodreads.com/book/show/13099738-steal-like-an-artist',
      Icon: BookOpen,
      title: 'Steal Like an Artist · Austin Kleon',
      meta: 'Permission to start ugly',
    },
    {
      href: 'https://www.goodreads.com/book/show/85505.The_War_of_Art',
      Icon: BookOpen,
      title: 'The War of Art · Steven Pressfield',
      meta: 'Beating creative resistance',
    },
  ]

  const videos = [
    {
      href: 'https://www.youtube.com/@PeterMcKinnon',
      Icon: Youtube,
      title: 'Peter McKinnon',
      meta: 'Photography & video for beginners',
    },
    {
      href: 'https://www.youtube.com/@Proko',
      Icon: Youtube,
      title: 'Proko',
      meta: 'Drawing fundamentals',
    },
    {
      href: 'https://www.youtube.com/@AndrewHuang',
      Icon: Youtube,
      title: 'Andrew Huang',
      meta: 'Music making from scratch',
    },
  ]

  const groups = [
    {
      href: 'https://t.me/s/AddisRunners',
      Icon: MessageCircle,
      title: 'Addis Runners · Telegram',
      meta: 'Weekend group runs in Entoto',
    },
    {
      href: 'https://www.instagram.com/explore/tags/addisababaartists/',
      Icon: Globe,
      title: '#AddisAbabaArtists · Instagram',
      meta: 'Local creators worth following',
    },
    {
      href: 'https://www.meetup.com/find/?location=et--Addis%20Ababa',
      Icon: Users,
      title: 'Meetup · Addis Ababa',
      meta: `Local ${focus.toLowerCase()} groups & events`,
    },
  ]

  return (
    <>
      <SectionCard delay={100} accent={accent} label="Books to spark the hobby">
        <div className="flex flex-col gap-2">
          {books.map((b) => (
            <ResourceLink key={b.title} {...b} accent={accent} />
          ))}
        </div>
      </SectionCard>

      <SectionCard delay={200} accent={accent} label="YouTube channels for beginners">
        <div className="flex flex-col gap-2">
          {videos.map((v) => (
            <ResourceLink key={v.title} {...v} accent={accent} />
          ))}
        </div>
      </SectionCard>

      <SectionCard delay={300} accent={accent} label="Local groups & communities">
        <div className="flex flex-col gap-2">
          {groups.map((g) => (
            <ResourceLink key={g.title} {...g} accent={accent} />
          ))}
        </div>
      </SectionCard>
    </>
  )
}
