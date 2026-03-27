import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solar Facility | Off-Grid Power for Portable Buildings — Multitrade",
  description:
    "Eliminate diesel generators with Multitrade's Solar Facility. RedEarth 20.5kWh battery storage, expandable to 32.8kWh. 15 × 590W solar panels. Available in 12x3.35m and 9x3.35m. ESG compliant off-grid power for remote worksites across Queensland.",
};

export default function SolarFacilityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
