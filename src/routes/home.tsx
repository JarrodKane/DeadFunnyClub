import { Link as RouterLink } from '@tanstack/react-router'
import { Link } from '../components'
import { LINKS } from '../constants'

export function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 justify-center h-full">
      <div className="flex flex-col gap-10 w-full items-center max-w-lg">
        {/* <img src="./dfc.png" className="w-90 h-90 rounded-full" /> */}
        <h1 className="text-3xl sm:text-6xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Dead Funny Club</h1>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Tickets and Shows</h1>
        <div className="flex flex-col gap-6 w-full px-4 sm:px-0">
          {LINKS.map(link => (
            <div key={link.url} className="flex flex-col gap-2">
              <Link href={link.url} icon={link.icon}>
                <div className="flex flex-col text-left w-full">
                  <span className="text-xs sm:text-sm">{link.time}</span>
                  <span className="text-sm sm:text-base font-semibold">{link.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Comics</h1>
        <RouterLink to="/melbourne" className="w-full px-4 sm:px-0">
          <div className="flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg border border-border">
            <span className="text-2xl">📊</span>
            <span>Melbourne Comedy Standup Sheet</span>
          </div>
        </RouterLink>
        <div className="w-full pb-6">
          <iframe
            src="https://www.instagram.com/deadfunny.club/embed/"
            width="100%"
            height="400"
            allowFullScreen
            allowTransparency={true}
          />
        </div>
        <div className="flex flex-col gap-6 w-full">
          {LINKS.map(link => (
            <div key={link.url} className="flex flex-col gap-2">
              <details>
                <summary className="cursor-pointer text-sm font-semibold mb-2 hover:text-muted-foreground">
                  ℹ️ {link.name} Details
                </summary>
                <div className="text-sm space-y-1 px-4 pb-2">
                  <p><span className="font-semibold">📍 Location:</span> {link.location}</p>
                  <p><span className="font-semibold">🕐 Time:</span> {link.time}</p>
                  <p><span className="font-semibold">💰 Price:</span> {link.price}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}