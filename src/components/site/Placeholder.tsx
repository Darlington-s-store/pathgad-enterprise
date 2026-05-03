export function Placeholder({
  label,
  className = "",
  ratio = "aspect-[4/3]",
  src,
  alt,
}: {
  label?: string;
  className?: string;
  ratio?: string;
  src?: string;
  alt?: string;
}) {
  if (src) {
    return (
      <div className={`relative ${ratio} w-full overflow-hidden rounded-lg ${className}`}>
        <img src={src} alt={alt || label || "PATHGAD"} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`relative ${ratio} w-full overflow-hidden rounded-lg bg-navy ${className}`}>
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent 0 16px, rgba(200,149,42,0.18) 16px 17px)",
      }} />
      <div className="absolute right-4 top-4 h-3 w-3 rounded-full bg-gold" />
      <div className="absolute bottom-4 left-4 font-display text-sm uppercase tracking-widest text-gold/90">
        {label || "PATHGAD"}
      </div>
    </div>
  );
}
