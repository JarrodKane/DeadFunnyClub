import { Link as RouterLink } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Link } from '../components';
import { LINKS } from '../constants';
import { Helmet } from 'react-helmet-async';


export function Home() {

  useEffect(() => {
    document.title = 'Dead Funny Club | Melbourne Stand-up Comedy Producer';

    // 2. Add Organization Schema
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EntertainmentBusiness",
      "name": "Dead Funny Club",
      "url": "https://deadfunny.club",
      "logo": "https://deadfunny.club/dfc.png",
      "sameAs": [
        "https://www.instagram.com/deadfunny.club/"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Melbourne",
        "addressRegion": "VIC",
        "addressCountry": "AU"
      },
      "description": "Running independent comedy rooms and open mics in Melbourne."
    };

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }, []);

  return (
    <>
      <Helmet>
        <title>Dead Funny Club | Melbourne Stand-up Comedy Producer</title>
        <meta name="description" content="Dead Funny Club - Your guide to Melbourne comedy shows, stand-up events, and open mics." />
        <link rel="canonical" href="https://deadfunny.club/" />

        {/* Open Graph */}
        <meta property="og:title" content="Dead Funny Club | Melbourne Stand-up Comedy Producer" />
        <meta property="og:description" content="Your guide to Melbourne comedy shows, stand-up events, and open mics." />
        <meta property="og:url" content="https://deadfunny.club/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Dead Funny Club" />
        <meta property="og:image" content="https://deadfunny.club/dfc.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dead Funny Club | Melbourne Stand-up Comedy Producer" />
        <meta name="twitter:description" content="Your guide to Melbourne comedy shows, stand-up events, and open mics." />
        <meta name="twitter:image" content="https://deadfunny.club/dfc.png" />
      </Helmet>
      <main className="flex min-h-screen flex-col items-center p-10 justify-center h-full">
        <div className="flex flex-col gap-10 w-full items-center max-w-lg">
          {/* <img src="./dfc.png" className="w-90 h-90 rounded-full" /> */}
          <h1 className="text-3xl sm:text-6xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Dead Funny Club</h1>
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Tickets and Shows</h2>
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
          <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>Comics</h2>
          <RouterLink to="/melbourne" className="w-full px-4 sm:px-0">
            <div className="flex items-center justify-center gap-3 bg-primary text-foreground py-4 rounded-lg font-bold hover:bg-accent hover:text-accent-foreground transition-all shadow-lg border border-border">
              <span className="text-2xl">📊</span>
              <span>Melbourne Comedy Standup Sheet</span>
            </div>
          </RouterLink>
          <div className="w-full pb-6">
            <iframe
              loading="lazy"
              src="https://www.instagram.com/deadfunny.club/embed/"
              width="100%"
              height="400"
              title="Dead Funny Club Instagram"
              allowFullScreen
              allowTransparency={true}
            />
          </div>
          <p className="text-center text-muted-foreground max-w-md px-4">
            Melbourne's home for independent <strong>stand-up comedy</strong>.
            We run the best <strong>open mic nights</strong> and curated shows
            across the city.
          </p>
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
    </>
  )
}