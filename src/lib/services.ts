import { ShoppingBag, Building2, Globe2, Briefcase, Truck, Users, Plane } from "lucide-react";

export const SERVICES = [
  { slug: "general-trading", name: "General Trading", icon: ShoppingBag,
    desc: "Wholesale and retail of a wide range of consumer and industrial goods across Ghana.",
    benefits: ["Diverse product portfolio", "Competitive wholesale pricing", "Reliable supply chain"] },
  { slug: "construction", name: "Building Construction", icon: Building2,
    desc: "End-to-end infrastructure and development projects — residential, commercial, civil.",
    benefits: ["Licensed contractors", "On-time delivery", "Quality-first workmanship"] },
  { slug: "import-export", name: "Import & Export", icon: Globe2,
    desc: "International trade of general goods with full customs and logistics handling.",
    benefits: ["Global supplier network", "Customs clearance", "Door-to-door delivery"] },
  { slug: "leather", name: "Leather Products Import", icon: Briefcase,
    desc: "Specialist sourcing and importing of premium leather goods and raw materials.",
    benefits: ["Premium quality grades", "Bulk and small-volume", "Ethical sourcing"] },
  { slug: "haulage", name: "Transport & Haulage", icon: Truck,
    desc: "Land freight and goods movement across Ghana and the West African corridor.",
    benefits: ["Modern fleet", "Tracked shipments", "Insured cargo"] },
  { slug: "passenger", name: "Passenger Land Transport", icon: Users,
    desc: "Comfortable and safe people-movement services for staff and groups.",
    benefits: ["Vetted drivers", "Air-conditioned fleet", "Charter and scheduled"] },
  { slug: "air-freight", name: "Freight Air Transport", icon: Plane,
    desc: "Time-critical air cargo logistics with global airline partnerships.",
    benefits: ["Express transit times", "Door-to-airport-to-door", "Specialist handling"] },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];
