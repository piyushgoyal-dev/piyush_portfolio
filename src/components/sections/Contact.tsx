import { lazy, Suspense, type FormEvent } from 'react';
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { profile } from '@/data/resume';
import { Page } from '@/components/layout/Page';
import { PageHeader, Reveal } from './Section';

// The globe pulls in d3-geo + the world map, so it loads in its own chunk.
const Globe = lazy(() => import('@/components/ui/globe'));

const FATEHABAD: [number, number] = [75.45, 29.52];

const labelClass = 'mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary/60';
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 sm:py-3 short:sm:py-2.5 text-primary placeholder:text-primary/35 outline-none transition duration-300 hover:border-white/20 focus:border-primary/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-primary/10';

export function Contact() {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const name = get('name');
    const company = get('company');
    const subject = `Portfolio enquiry from ${name}${company ? ` (${company})` : ''}`;
    const body = `${get('message')}\n\n— ${name}${company ? `, ${company}` : ''}\n${get('email')}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const channels = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, Icon: Mail },
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phoneHref}`, Icon: Phone },
    { label: 'Location', value: `${profile.location}, India`, Icon: MapPin },
    { label: 'Résumé', value: 'Open PDF', href: profile.resume, newTab: true, Icon: FileText },
  ];
  const socials = [
    { label: 'LinkedIn', value: 'Profile', href: profile.linkedin, newTab: true, Icon: Linkedin },
    { label: 'GitHub', value: 'Profile', href: profile.github, newTab: true, Icon: Github },
  ].filter((s) => s.href);
  // phones + tablets: every channel as one row of icon buttons
  const iconRow = [...channels, ...socials];

  return (
    <Page>
      <PageHeader
        eyebrow="05 — Contact"
        title="Contact me."
        intro="Have a project, a role or an idea? Tell me what you're building — I reply within one business day."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        {/* left: channels + globe */}
        <Reveal className="flex flex-col">
          <ul className="grid gap-2 lg:hidden" style={{ gridTemplateColumns: `repeat(${iconRow.length}, minmax(0, 1fr))` }}>
            {iconRow.map(({ label, value, href, newTab, Icon }) => {
              const cls = 'flex h-12 xshort:h-11 items-center justify-center rounded-2xl border border-white/10 text-primary/85 transition-colors hover:border-primary/40 hover:text-primary';
              const name = `${label}: ${value}`;
              return (
                <li key={label}>
                  {href ? (
                    <a href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} title={name} aria-label={name} className={cls}>
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </a>
                  ) : (
                    <span role="img" title={name} aria-label={name} className={cls}>
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* desktop: labelled list + social buttons */}
          <ul className="hidden gap-1 lg:grid">
            {channels.map(({ label, value, href, newTab, Icon }) => {
              const content = (
                <>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-primary/80 transition-colors duration-300 group-hover:border-primary/40 group-hover:text-primary">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-primary/50">{label}</span>
                    <span className="block truncate text-[15px] text-primary/90 transition-colors duration-300 group-hover:text-primary">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label} className="min-w-0">
                  {href ? (
                    <a href={href} {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="group -mx-2 flex items-center gap-3 rounded-2xl p-2 transition-colors duration-300 hover:bg-white/[0.04]">
                      {content}
                    </a>
                  ) : (
                    <div className="group -mx-2 flex items-center gap-3 p-2">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>

          {socials.length > 0 && (
            <div className="mt-3 hidden flex-wrap gap-2 lg:flex">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-primary transition-colors hover:border-primary/50">
                  <s.Icon className="h-4 w-4" aria-hidden="true" />
                  {s.label}
                </a>
              ))}
            </div>
          )}

          {/* globe peeking up like a horizon — desktop with enough height only */}
          <div className="relative mt-6 hidden flex-1 [@media(min-width:1024px)_and_(min-height:860px)]:block">
            <div className="relative h-[min(200px,20dvh)] overflow-hidden">
              <div className="absolute left-1/2 top-0 w-[min(400px,100%)] -translate-x-1/2">
                <Suspense fallback={<div className="aspect-square w-full" />}>
                  <Globe marker={FATEHABAD} speed={6} tilt={24} startLon={115} />
                </Suspense>
              </div>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />
            </div>
            <p className="mt-2 flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/55">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F2D4DF] shadow-[0_0_8px_#F2D4DF]" /> Based in Fatehabad, India · IST
            </p>
          </div>
        </Reveal>

        {/* right: form */}
        <Reveal delay={0.1}>
          <form onSubmit={onSubmit} className="rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] xshort:p-4 sm:p-7 tiny:sm:p-5">
            <h2 className="text-xl font-medium tracking-tight text-primary max-sm:sr-only md:text-2xl">Send a message</h2>
            <p className="mt-1 text-[15px] text-primary/65 max-sm:hidden short:hidden">I'll get back to you promptly.</p>
            <div aria-hidden="true" className="my-5 border-t border-dotted border-white/15 max-sm:hidden short:my-4" />

            <div className="grid gap-4 sm:grid-cols-2 tiny:sm:grid-cols-1">
              <label className="block">
                <span className={labelClass}>Full name</span>
                <input name="name" required autoComplete="name" placeholder="Your name" className={inputClass} />
              </label>
              <label className="block max-sm:hidden tiny:hidden">
                <span className={labelClass}>
                  Company <span className="normal-case tracking-normal text-primary/40">(optional)</span>
                </span>
                <input name="company" autoComplete="organization" placeholder="Where you work" className={inputClass} />
              </label>
            </div>
            <label className="mt-3 block sm:mt-4">
              <span className={labelClass}>Email address</span>
              <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
            </label>
            <label className="mt-3 block sm:mt-4">
              <span className={labelClass}>Message</span>
              <textarea name="message" required rows={3} placeholder="Tell me about your project, role or idea…" className={`${inputClass} resize-none short:h-20 tiny:h-20 xshort:h-14`} />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-primary/50 max-sm:hidden">Opens your email app with everything filled in.</p>
              <button
                type="submit"
                className="group inline-flex items-center gap-2 rounded-full bg-primary py-1 pl-5 pr-1 text-sm font-medium text-black transition-all duration-300 hover:gap-3 hover:shadow-[0_10px_30px_-10px_rgba(225,224,204,0.6)] sm:text-base"
              >
                Send message
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-110">
                  <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </Page>
  );
}
