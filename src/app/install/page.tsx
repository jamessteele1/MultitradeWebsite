import Header from "@/components/Header";
import MobileCTA from "@/components/MobileCTA";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { installServices } from "./services";
import styles from "./install.module.css";

export const metadata: Metadata = {
  title: "Turnkey Installation & Associated Services",
  description:
    "A complete portable building solution: hire or purchase, planning, delivery, installation, civil works, access and maintenance, coordinated by Multitrade Building Hire.",
  alternates: { canonical: "/install" },
};

export default function InstallPage() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroPhoto}>
            <Image
              src="/images/install/gatehouse-crane-placement-hero.webp"
              alt="Crew and crane positioning a portable building during installation"
              fill
              priority
              sizes="(max-width:800px) 100vw, 65vw"
            />
          </div>
          <div className={styles.heroInner}>
            <nav aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span> / Installation & associated services</span>
            </nav>
            <p className={styles.eyebrow}>More than building hire</p>
            <h1>
              The building.
              <br />
              The site works.
              <br />
              <span>One complete solution.</span>
            </h1>
            <p className={styles.lead}>
              Hire or buy your buildings and let Multitrade Building Hire bring
              the whole project together. From planning and supply to
              installation, connections and ongoing support.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/quote">
                Discuss your project
              </Link>
              <a className={styles.secondary} href="#services">
                Explore the services
              </a>
            </div>
          </div>
        </section>
        <section className={styles.intro} id="services">
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Installation & associated services</p>
            <h2>One point of contact. From first plan to handover.</h2>
            <p>
              Bring us the whole requirement. We coordinate the buildings, site
              works, transport and specialist trades as one turnkey package,
              with a clear scope and a single MBH contact.
            </p>
          </div>
        </section>
        {installServices.map((service, index) => (
          <section
            className={`${styles.service} ${index % 2 === 1 ? styles.dark : ""}`}
            id={service.id}
            key={service.id}
            aria-labelledby={`${service.id}-heading`}
          >
            <div className={`${styles.wrap} ${styles.serviceGrid}`}>
              <figure>
                <a
                  href={
                    service.image.startsWith("/")
                      ? service.image
                      : `/images/install/${service.image}`
                  }
                  aria-label={`View full-size image: ${service.alt}`}
                >
                  <Image
                    src={
                      service.image.startsWith("/")
                        ? service.image
                        : `/images/install/${service.image}`
                    }
                    alt={service.alt}
                    width={service.width}
                    height={service.height}
                    sizes="(max-width:800px) calc(100vw - 40px), 45vw"
                    className={styles.servicePhoto}
                  />
                </a>
                <figcaption>{service.caption}</figcaption>
              </figure>
              <div>
                <p className={styles.eyebrow}>
                  {String(index + 1).padStart(2, "0")} / {service.tag}
                </p>
                <h2 id={`${service.id}-heading`}>{service.title}</h2>
                <p className={styles.description}>{service.description}</p>
                {index === 0 && (
                  <span id="manufacturing" className={styles.anchor} />
                )}
                <div className={styles.details}>
                  {service.details.map(([title, text]) => (
                    <details key={title}>
                      <summary>
                        {title}
                        <span aria-hidden="true" />
                      </summary>
                      <p>{text}</p>
                    </details>
                  ))}
                </div>
                <Link href="/quote" className={styles.textLink}>
                  Include this in my project
                </Link>
              </div>
            </div>
          </section>
        ))}
        <section className={styles.projects}>
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>See it on site</p>
            <h2>Buildings and site works, delivered together.</h2>
            <div className={styles.projectGrid}>
              <Link href="/case-studies/alpha-hpa">
                <Image
                  src="/images/case-studies/alpha-hpa/IMG_4020.jpg"
                  alt="Office complex with entry ramps and custom steel foundations"
                  width={1200}
                  height={800}
                  sizes="(max-width:800px) 90vw,45vw"
                />
                <h3>An office complex on engineered foundations</h3>
                <p>
                  Building supply, custom supports, installation and access
                  brought together for a constrained site.
                </p>
                <span>Read the case study</span>
              </Link>
              <Link href="/case-studies/gladstone-hockey">
                <Image
                  src="/images/case-studies/gladstone-hockey/hero.jpg"
                  alt="Client and Multitrade representative in front of an amenities building with a covered entry"
                  width={1200}
                  height={900}
                  sizes="(max-width:800px) 90vw,45vw"
                />
                <h3>Amenities with access and a covered area</h3>
                <p>
                  A complete building package with footings, concrete, ramps and
                  shelter around the facility.
                </p>
                <span>Read the case study</span>
              </Link>
            </div>
          </div>
        </section>
        <section className={styles.delivery}>
          <div className={`${styles.wrap} ${styles.deliveryGrid}`}>
            <div>
              <p className={styles.eyebrow}>Coordinated by MBH</p>
              <h2>Group capability. One delivery team.</h2>
              <p>
                Multitrade Building Hire is your point of contact for the
                complete package. Our group business, Multitrade Contracting,
                brings installation, construction and maintenance capability,
                supported by engineers and licensed specialist contractors.
              </p>
              <a
                href="https://multitradecontracting.com.au"
                className={styles.textLink}
              >
                Meet Multitrade Contracting
              </a>
            </div>
            <div>
              <h3>Systems that support the work</h3>
              <p>
                MBH’s integrated management system supports quality,
                environmental and safety management. Project documentation can
                include inspection and test plans, work activity briefs,
                engineering records and handover information to suit the agreed
                requirements.
              </p>
              <a
                href="https://qdos.equalassurance.com/certificates/MHRQ01"
                className={styles.textLink}
              >
                View MBH’s ISO certification
              </a>
            </div>
          </div>
        </section>
        <section className={`${styles.cta} ${styles.dark}`}>
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Let’s bring it together</p>
            <h2>
              Tell us about the site.
              <br />
              We’ll help shape the whole solution.
            </h2>
            <p>
              Share the location, intended use, timing and any drawings or site
              photos. We’ll work through the building and associated services
              with you.
            </p>
            <div className={styles.actions}>
              <Link href="/quote" className={styles.primary}>
                Discuss your project
              </Link>
              <a href="tel:0749792333" className={styles.secondary}>
                Call (07) 4979 2333
              </a>
            </div>
          </div>
        </section>
      </main>
      <MobileCTA />
    </>
  );
}
