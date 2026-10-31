import Image from "next/image";
import Link from "next/link";

const photos = [
  { src: "bella-fun-run", alt: "Runners passing through the Bella the Brave arch carrying the Multitrade logo" },
  { src: "harbour-festival", alt: "Harbour Festival representative holding the Multitrade Building Hire sign outside an event building" },
  { src: "police-raft-team", alt: "Gladstone Police raft-race team at the Harbour Festival" },
  { src: "united-football", alt: "Gladstone United Football Club players with their footballs" },
  { src: "rotary-volunteers", alt: "Rotary volunteers at a charity golf day with a Multitrade banner" },
  { src: "yacht-race-volunteers", alt: "Brisbane to Gladstone Yacht Race volunteers at the finish" },
];

export default function CommunityFeature({ compact = false }: { compact?: boolean }) {
  return (
    <section id="in-our-community" aria-labelledby="community-feature-title" className="py-16 md:py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">In Our Community</div>
          <h2 id="community-feature-title" className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {compact ? "Part of the community." : "Backing the community we call home."}
          </h2>
          <p className="text-gray-600 mt-5 leading-relaxed max-w-lg">
            From local clubs and fundraisers to the events that bring Central Queensland together, MBH is proud to lend a hand. Our support includes sponsorship, donated building and toilet hire, transport, installation and time from our team.
          </p>
          <Link href="/community" className="inline-flex items-center justify-center mt-7 px-7 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-900">
            See our community support
          </Link>
          {!compact && <p className="text-sm text-gray-500 mt-6 max-w-lg">Bella the Brave, Gladstone Harbour Festival, local sporting clubs, Rotary and many more.</p>}
        </div>
        <div className={`grid grid-cols-3 gap-2 md:gap-3 ${compact ? "grid-rows-2 h-[300px] md:h-[360px]" : "grid-rows-3 h-[390px] md:h-[510px]"}`} aria-label="Community support photo collection">
          {photos.slice(0, compact ? 3 : 6).map((photo, i) => (
            <div key={photo.src} className={`relative overflow-hidden rounded-xl ${compact ? (i === 0 ? "col-span-2 row-span-2" : "") : (i === 0 || i === 5 ? "col-span-2" : i === 1 ? "row-span-2" : "")}`}>
              <Image src={`/images/community/${photo.src}.jpg`} alt={photo.alt} fill sizes="(max-width: 1023px) 65vw, 32vw" className="object-cover" style={photo.src === "harbour-festival" ? { objectPosition: "50% 40%" } : undefined} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
