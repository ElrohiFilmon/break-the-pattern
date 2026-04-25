# PatternBreaker Addis

A modern web application that helps users break patterns by getting AI-powered insights from four unique advisor perspectives: Rebel, Sage, Guide, and Echo.

## Features

- **Challenge Input**: Submit patterns or challenges you want to break
- **Multi-Perspective Responses**: Get insights from four distinct advisor viewpoints
- **Shareable Cards**: Export challenges and responses as beautiful 9:16 cards
- **History Tracking**: Keep track of all your past challenges
- **Analytics Dashboard**: View your pattern-breaking journey with stats and activity logs
- **Social Sharing**: Share challenges directly through native sharing APIs
- **Dark Theme UI**: Beautiful, modern dark interface with responsive design

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui library
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Export**: html2canvas for card downloads
- **Analytics**: Custom event tracking system

## Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Home page
│   ├── challenge/
│   │   ├── page.tsx            # Challenge input form
│   │   └── [id]/page.tsx       # Challenge detail view
│   ├── history/
│   │   └── page.tsx            # History dashboard
│   └── stats/
│       └── page.tsx            # Analytics dashboard
├── components/                   # Reusable components
│   ├── navigation.tsx           # Top navigation
│   ├── agent-card.tsx          # Agent response display
│   ├── pattern-card.tsx        # History card component
│   └── shareable-card.tsx      # 9:16 export card
├── lib/                         # Utilities and core logic
│   ├── types.ts                # TypeScript interfaces
│   ├── agents.ts               # Agent configurations
│   ├── mock-responses.ts       # AI response database
│   ├── context.tsx             # React Context provider
│   ├── storage.ts              # localStorage utilities
│   ├── analytics.ts            # Analytics tracking
│   └── share.ts                # Social sharing utilities
├── public/                      # Static assets
├── tailwind.config.ts          # Tailwind configuration
└── globals.css                 # Global styles with design tokens
```

## Getting Started

### Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## Pages and Routes

- `/` - Home page with introduction and advisor profiles
- `/challenge` - Create a new challenge
- `/challenge/[id]` - View challenge responses and export card
- `/history` - View all past challenges
- `/stats` - Analytics and activity log dashboard

## Design System

### Color Palette
- **Primary Background**: Pure black (#000000)
- **Secondary Background**: Dark slate (oklch(0.12 0 0))
- **Text Primary**: White (oklch(0.95 0 0))
- **Text Secondary**: Gray (oklch(0.6 0 0))
- **Agent Colors**:
  - Rebel (Pink): #FF2D78
  - Sage (Gold): #FFB800
  - Guide (Green): #00FF88
  - Echo (Cyan): #00D4FF

### Typography
- **Display**: Geist (font-sans)
- **Monospace**: Geist Mono (font-mono)

### Layout
- Mobile-first responsive design
- Flexbox-based layouts
- Max-width containers (max-w-4xl, max-w-5xl)
- Consistent spacing scale using Tailwind spacing utilities

## Data Persistence

All user data is stored in the browser's localStorage:
- Challenge history
- Analytics events
- User preferences

Data is automatically synced and persisted across sessions.

## Analytics

The app tracks the following events:
- Challenge created
- Challenge viewed
- Card exported
- Card shared
- History cleared

Access analytics data at `/stats` route or programmatically via `analytics.getEvents()`.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel Dashboard
3. Environment variables are automatically configured
4. Deploy with a single click

### Deploy to Other Platforms

The app can be deployed to any platform supporting Next.js 16:
- Netlify
- AWS Amplify
- Railway
- Render
- etc.

Simply run `pnpm build` and follow the platform-specific deployment instructions.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- Lazy loading components with React.lazy()
- Image optimization with Next.js Image component
- CSS-in-JS with Tailwind for minimal bundle size
- Client-side routing for instant navigation
- LocalStorage for fast data retrieval

## Future Enhancements

- Backend API integration for persistent storage
- User authentication and accounts
- Shared challenge collaboration
- Real AI model integration
- Mobile app versions
- Export formats (PDF, JSON)
- Dark/Light theme toggle
- Internationalization (i18n)

## Contributing

This is a v0-generated project. Feel free to modify and customize as needed.

## License

MIT

## Support

For issues or questions, please refer to the v0 documentation at https://v0.dev.
