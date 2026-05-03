import { ShoppingBag, Building2, Globe2, Briefcase, Truck, Users, Plane, Warehouse, HardHat, Wrench } from "lucide-react";
import trading from "@/assets/svc-trading.jpg";
import construction from "@/assets/svc-construction.jpg";
import importExport from "@/assets/svc-import-export.jpg";
import leather from "@/assets/svc-leather.jpg";
import haulage from "@/assets/svc-haulage.jpg";
import passenger from "@/assets/svc-passenger.jpg";
import airFreight from "@/assets/svc-air-freight.jpg";

export const SERVICES = [
  { slug: "general-trading", name: "General Trading", icon: ShoppingBag, image: trading,
    desc: "Wholesale and retail of a wide range of consumer and industrial goods across Ghana.",
    benefits: ["Diverse product portfolio", "Competitive wholesale pricing", "Reliable supply chain"] },
  { slug: "construction", name: "Building Construction", icon: Building2, image: construction,
    desc: "End-to-end infrastructure and development projects — residential, commercial, civil.",
    benefits: ["Licensed contractors", "On-time delivery", "Quality-first workmanship"] },
  { slug: "import-export", name: "Import & Export", icon: Globe2, image: importExport,
    desc: "International trade of general goods with full customs and logistics handling.",
    benefits: ["Global supplier network", "Customs clearance", "Door-to-door delivery"] },
  { slug: "leather", name: "Leather Products Import", icon: Briefcase, image: leather,
    desc: "Specialist sourcing and importing of premium leather goods and raw materials.",
    benefits: ["Premium quality grades", "Bulk and small-volume", "Ethical sourcing"] },
  { slug: "haulage", name: "Transport & Haulage", icon: Truck, image: haulage,
    desc: "Land freight and goods movement across Ghana and the West African corridor.",
    benefits: ["Modern fleet", "Tracked shipments", "Insured cargo"] },
  { slug: "passenger", name: "Passenger Land Transport", icon: Users, image: passenger,
    desc: "Comfortable and safe people-movement services for staff and groups.",
    benefits: ["Vetted drivers", "Air-conditioned fleet", "Charter and scheduled"] },
  { slug: "air-freight", name: "Freight Air Transport", icon: Plane, image: airFreight,
    desc: "Time-critical air cargo logistics with global airline partnerships.",
    benefits: ["Express transit times", "Door-to-airport-to-door", "Specialist handling"] },
  { slug: "warehousing", name: "Warehousing & Storage", icon: Warehouse, image: importExport,
    desc: "Secure short and long-term storage with inventory management for traders and importers.",
    benefits: ["24/7 security", "Inventory tracking", "Strategic locations"] },
  { slug: "project-management", name: "Project Management", icon: HardHat, image: construction,
    desc: "Turnkey planning, procurement and supervision for construction and infrastructure projects.",
    benefits: ["Certified PMs", "Cost control", "Risk management"] },
  { slug: "equipment-rental", name: "Equipment Rental", icon: Wrench, image: haulage,
    desc: "Heavy machinery and commercial vehicles available on flexible rental terms.",
    benefits: ["Maintained fleet", "Operator optional", "Daily to monthly rates"] },
] as const;

export type ServiceSlug = (typeof SERVICES)[number]["slug"];

