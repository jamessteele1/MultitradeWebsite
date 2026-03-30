"use client";

import { useState } from "react";

const BOWEN_BASIN_MINES = [
  "Blackwater Mine",
  "Broadmeadow Mine",
  "Caval Ridge Mine",
  "Coppabella Mine",
  "Curragh Mine",
  "Daunia Mine",
  "Goonyella Riverside Mine",
  "Grosvenor Mine",
  "Hail Creek Mine",
  "Isaac Plains Mine",
  "Lake Vermont Mine",
  "Moranbah North Mine",
  "North Goonyella Mine",
  "Oaky Creek Mine",
  "Peak Downs Mine",
  "Poitrel Mine",
  "Saraji Mine",
  "South Walker Creek Mine",
  "Middlemount Mine",
  "Carborough Downs Mine",
  "Burton Mine",
  "Foxleigh Mine",
  "Jellinbah Mine",
  "Millennium Mine",
  "Moorvale Mine",
  "Norwich Park Mine",
  "Olive Downs Mine",
  "Red Hill Mine",
  "Rolleston Mine",
  "Sonoma Mine",
  "Yarrabee Mine",
];

type Props = {
  buildingSize: "12x3" | "6x3" | "3x3" | "other";
  onUpdate?: (data: { powerType: string; mineSpec: boolean; mineName: string }) => void;
};

export default function PowerSiteRequirements({ buildingSize, onUpdate }: Props) {
  const [powerType, setPowerType] = useState<"site" | "generator" | "">("");
  const [mineSpec, setMineSpec] = useState<boolean | null>(null);
  const [mineName, setMineName] = useState("");
  const [mineSearch, setMineSearch] = useState("");
  const [showMineDropdown, setShowMineDropdown] = useState(false);

  const plugSize = buildingSize === "12x3" || buildingSize === "other" ? "32amp single phase" : "15amp";

  const filteredMines = BOWEN_BASIN_MINES.filter((m) =>
    m.toLowerCase().includes(mineSearch.toLowerCase())
  ).sort();

  const handlePowerChange = (type: "site" | "generator") => {
    setPowerType(type);
    onUpdate?.({ powerType: type, mineSpec: mineSpec ?? false, mineName });
  };

  const handleMineSpecChange = (val: boolean) => {
    setMineSpec(val);
    if (!val) setMineName("");
    onUpdate?.({ powerType, mineSpec: val, mineName: val ? mineName : "" });
  };

  const selectMine = (name: string) => {
    setMineName(name);
    setMineSearch(name);
    setShowMineDropdown(false);
    onUpdate?.({ powerType, mineSpec: true, mineName: name });
  };

  return (
    <section className="py-10 md:py-14 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Power & Site Requirements</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Power Connection */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Power Connection</h3>
            <p className="text-xs text-gray-500 mb-4">
              How will this building be powered on site?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handlePowerChange("site")}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  powerType === "site"
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  powerType === "site" ? "border-amber-500" : "border-gray-300"
                }`}>
                  {powerType === "site" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Site Power</span>
                  <span className="ml-1.5 text-[10px] font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">STANDARD</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hardwired to existing site power supply. Standard {plugSize} connection included.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handlePowerChange("generator")}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  powerType === "generator"
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  powerType === "generator" ? "border-amber-500" : "border-gray-300"
                }`}>
                  {powerType === "generator" && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Generator Power</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Building will be powered via generator. Requires {plugSize} plug input.
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 italic">
                    Note: Multitrade does not hire generators or supply generator leads.
                  </p>
                </div>
              </button>
            </div>

            {powerType === "generator" && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-blue-800">
                      {plugSize === "32amp single phase" ? "32 Amp Single Phase Plug" : "15 Amp Plug"} Required
                    </p>
                    <p className="text-[10px] text-blue-600 mt-0.5">
                      {plugSize === "32amp single phase"
                        ? "Standard for 12x3m buildings. Ensure your generator has a compatible 32A single phase outlet."
                        : "Standard for 6x3m and smaller buildings. Ensure your generator has a compatible 15A outlet."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mine Spec Electrical */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg shadow-black/5 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Mine-Spec Electrical Upgrades</h3>
            <p className="text-xs text-gray-500 mb-4">
              Does this building require mine-spec electrical compliance?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleMineSpecChange(true)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  mineSpec === true
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  mineSpec === true ? "border-amber-500" : "border-gray-300"
                }`}>
                  {mineSpec === true && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Yes — Mine-Spec Required</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Electrical fit-out to mine site standards. Please select the mine below.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleMineSpecChange(false)}
                className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  mineSpec === false
                    ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500/20"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  mineSpec === false ? "border-amber-500" : "border-gray-300"
                }`}>
                  {mineSpec === false && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">No — Standard Electrical</span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Standard commercial electrical fit-out. Suitable for most construction and industrial sites.
                  </p>
                </div>
              </button>
            </div>

            {/* Mine selector */}
            {mineSpec === true && (
              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-700 mb-1.5 block">Select Mine Site</label>
                <div className="relative">
                  <input
                    type="text"
                    value={mineSearch}
                    onChange={(e) => {
                      setMineSearch(e.target.value);
                      setMineName("");
                      setShowMineDropdown(true);
                    }}
                    onFocus={() => setShowMineDropdown(true)}
                    placeholder="Type to search or enter mine name..."
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
                  />
                  {showMineDropdown && mineSearch.length > 0 && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl max-h-48 overflow-y-auto">
                      {filteredMines.length > 0 ? (
                        filteredMines.map((mine) => (
                          <button
                            key={mine}
                            onClick={() => selectMine(mine)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-amber-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {mine}
                          </button>
                        ))
                      ) : (
                        <button
                          onClick={() => selectMine(mineSearch)}
                          className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50"
                        >
                          Use &ldquo;{mineSearch}&rdquo; as mine name
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {mineName && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    {mineName}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
