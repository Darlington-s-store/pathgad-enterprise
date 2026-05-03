export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  alt,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image: string;
  alt?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-primary-foreground">
      <img
        src={image}
        alt={alt || title}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,27,62,0.85) 0%, rgba(13,27,62,0.7) 60%, rgba(13,27,62,0.95) 100%)",
        }}
      />
      <div className="container-pg relative py-20 md:py-24">
        <span className="text-xs font-semibold uppercase tracking-widest text-gold">{eyebrow}</span>
        <h1 className="mt-2 max-w-3xl font-display text-4xl font-bold leading-tight md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-primary-foreground/80 md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
