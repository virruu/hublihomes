import { bhkLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyImage({
  property,
  gradient,
  className = "",
  label = true,
}: {
  property: Property;
  gradient?: string;
  className?: string;
  label?: boolean;
}) {
  const grad = gradient ?? property.gradient;
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${grad} ${className}`}
      role="img"
      aria-label={property.title}
    >
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
      <div className="absolute inset-0 [background-image:linear-gradient(transparent_60%,rgba(0,0,0,0.45))]" />
      {label && (
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-xs font-medium uppercase tracking-wide opacity-90">
            {property.locality}
          </p>
          <p className="text-lg font-bold leading-tight">{bhkLabel(property)}</p>
        </div>
      )}
    </div>
  );
}
