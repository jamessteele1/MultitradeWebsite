import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import { communityGallery, communityGroups } from "@/data/community";

export const metadata: Metadata = {
  title: "In Our Community",
  description: "Meet the clubs, charities and events MBH supports across Central Queensland through sponsorship, donated hire, transport and hands-on help.",
  alternates: { canonical: "/community" },
  openGraph: {
    title: "In Our Community | Multitrade Building Hire",
    description: "Backing the community we call home. Local people, local events and practical support across Central Queensland.",
    url: "/community",
    images: [{ url: "/images/community/bella-fun-run.jpg", alt: "Bella the Brave community fun run" }],
  },
};

export default function CommunityPage() {
  return <>
    <Header />
    <main>
      <section style={{ background: "linear-gradient(135deg, var(--navy), var(--navy-2))" }}>
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-14 md:pt-14 md:pb-20">
          <nav aria-label="Breadcrumb" className="flex gap-2 text-xs text-white/70 mb-8">
            <Link href="/">Home</Link><span>/</span><Link href="/about">About Us</Link><span>/</span><span aria-current="page">In Our Community</span>
          </nav>
          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-4">In Our Community</div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">Backing the community <span className="gold-text">we call home.</span></h1>
              <p className="text-white/80 mt-6 text-lg leading-relaxed max-w-lg">At Multitrade Building Hire (MBH), we live and work here too. We’re proud to support the clubs, charities, schools and events that bring Central Queensland together.</p>
              <p className="text-white/70 mt-4 leading-relaxed max-w-lg">Sometimes that means sponsorship. Sometimes it means a building, facilities for an event, a delivery or our team getting involved.</p>
              <a href="#organisations" className="inline-flex mt-8 px-7 py-3.5 rounded-lg font-semibold text-gray-900 bg-gold hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Meet the organisations we support</a>
            </div>
            <figure className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
              <Image src="/images/community/bella-fun-run.jpg" alt="Runners passing through the Multitrade-supported Bella the Brave fun-run arch" fill priority sizes="(max-width: 1023px) 100vw, 58vw" className="object-cover" />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-6 pt-12 pb-5 text-white text-sm font-semibold">Getting behind Bella the Brave</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="practical-support">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl mb-10">
            <h2 id="practical-support" className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Helping local events happen.</h2>
            <p className="text-gray-600 leading-relaxed mt-4">There’s plenty that goes on behind the scenes. From setting up a building to getting facilities ready for the crowd, practical help is a big part of how we contribute.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-14 items-center">
            <figure className="relative aspect-[4/5] max-h-[620px] overflow-hidden rounded-xl bg-gray-100">
              <Image src="/images/community/harbour-festival.jpg" alt="Harbour Festival representative holding the MBH sign outside a donated hire building" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" style={{ objectPosition: "center 38%" }} />
            </figure>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Gladstone Harbour Festival & Easter</div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">A little help behind a big weekend.</h3>
              <p className="text-gray-600 leading-relaxed mt-5">Easter brings our harbour to life. We help with the buildings and facilities that organisers and visitors rely on, along with donated transport and installation by our team.</p>
              <ul className="mt-6 space-y-5 text-gray-600">
                <li className="border-l-2 border-gold pl-4"><strong className="block text-gray-900 mb-1">Gladstone Harbour Festival</strong>Administration-building hire to help the event team get set up.</li>
                <li className="border-l-2 border-gold pl-4"><strong className="block text-gray-900 mb-1">Brisbane to Gladstone Yacht Race</strong>An annual donation of 6 × 3 m crib hire.</li>
                <li className="border-l-2 border-gold pl-4"><strong className="block text-gray-900 mb-1">Yacht Club Easter Party</strong>Toilet buildings for the Easter celebrations.</li>
              </ul>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <article className="rounded-xl overflow-hidden border border-gray-200 bg-white">
              <div className="relative aspect-[4/3]"><Image src="/images/community/police-raft-team.jpg" alt="Gladstone Police raft-race team at the Harbour Festival waterfront" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div>
              <div className="p-6 md:p-8"><h3 className="text-xl font-extrabold text-gray-900">Built by our team. Paddled by theirs.</h3><p className="text-gray-600 leading-relaxed mt-3">The whole MBH team built, supplied and painted QPV Pork Chop for Gladstone Police to take on the 2026 Harbour Festival raft race. A different kind of building project, and one we were happy to get behind.</p></div>
            </article>
            <article className="rounded-xl overflow-hidden border border-gray-200 bg-white">
              <div className="relative aspect-[4/3]"><Image src="/images/community/bella-community.jpg" alt="Families gathering at Bella the Brave’s Run for a Cure" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div>
              <div className="p-6 md:p-8"><h3 className="text-xl font-extrabold text-gray-900">Getting behind Bella the Brave.</h3><p className="text-gray-600 leading-relaxed mt-3">We’re proud to support Run for a Cure. Our 2026 contribution included Platinum sponsorship, BBQ food and practical help on the day, alongside the many volunteers and supporters who make the event possible.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-gray-200" aria-labelledby="emerging-artists">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-14">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase gold-text mb-3">Arts & emerging talent</div>
            <h2 id="emerging-artists" className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Encouraging the next generation.</h2>
          </div>
          <div className="text-gray-600 leading-relaxed">
            <p>MBH is a longstanding supporter of the Martin Hanson Memorial Art Awards. In 2026, we’re proud to sponsor the Pieter Groen-int-woud Memorial Young Emerging Artist Award at the 51st Rio Tinto Yarwun &amp; QAL Martin Hanson Memorial Art Awards.</p>
            <p className="mt-4">It’s one way we help recognise young creative talent in our community.</p>
            <a href="https://gragm.qld.gov.au/art-awards" className="inline-block mt-5 font-semibold text-gray-900 underline decoration-gold decoration-2 underline-offset-4">Explore the awards at Gladstone Regional Art Gallery &amp; Museum</a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-200" aria-labelledby="community-photos">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="community-photos" className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Local people. Shared moments.</h2>
          <p className="text-gray-600 mt-4 mb-10 max-w-2xl leading-relaxed">A few familiar faces from clubs, fundraisers and community events we’ve been part of over the years.</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {communityGallery.map(photo => <figure key={photo.src} className="overflow-hidden rounded-xl bg-white border border-gray-200">
              <div className="relative aspect-[4/3]"><Image src={`/images/community/${photo.src}.jpg`} alt={photo.alt} fill sizes="(max-width: 1023px) 50vw, 33vw" className="object-cover" style={photo.src === "mountain-biking" ? { objectPosition: "50% 32%" } : undefined} /></div>
              <figcaption className="p-3 md:p-4 text-xs md:text-sm font-semibold text-gray-800">{photo.caption}</figcaption>
            </figure>)}
          </div>
        </div>
      </section>

      <section id="organisations" className="py-16 md:py-24 scroll-mt-24" aria-labelledby="organisations-title">
        <div className="max-w-7xl mx-auto px-4">
          <h2 id="organisations-title" className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Organisations & events we’ve supported.</h2>
          <p className="text-gray-600 mt-4 max-w-2xl leading-relaxed">From sponsorship and fundraising to donated hire and hands-on help, these are some of the community connections MBH is proud of. This list brings together support over the years, with earlier events noted separately.</p>
          <div className="mt-12 space-y-12">
            {communityGroups.map(group => <div key={group.title} className="grid lg:grid-cols-[1fr_3fr] gap-6 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-900">{group.title}</h3>
              <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                {group.organisations.map(([name, description]) => <li key={name}><h4 className="font-semibold text-gray-900">{name}</h4><p className="text-sm text-gray-600 leading-relaxed mt-1">{description}</p></li>)}
              </ul>
            </div>)}
          </div>
          <div className="mt-14 border-t border-gray-200 pt-8"><Link href="/about" className="font-semibold text-gray-900 underline decoration-gold decoration-2 underline-offset-4">More about Multitrade</Link></div>
        </div>
      </section>
    </main>
    <MobileCTA />
  </>;
}
