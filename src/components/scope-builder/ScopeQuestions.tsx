import type { ChangeEvent } from "react";
import type {
  HireOrBuy,
  PowerAccess,
  ScopeBuilderInput,
  ServiceAccess,
} from "@/lib/scope-builder/schema";

type Props = {
  values: ScopeBuilderInput;
  onChange: (field: keyof ScopeBuilderInput, value: string | number | boolean) => void;
};

export default function ScopeQuestions({ values, onChange }: Props) {
  const onText =
    (field: keyof ScopeBuilderInput) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
        <input
          value={values.industry}
          onChange={onText("industry")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Mining, civil, industrial"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
        <input
          value={values.projectType}
          onChange={onText("projectType")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Site office setup, crib + ablution"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hire or Buy</label>
        <select
          value={values.hireOrBuy}
          onChange={(event) => onChange("hireOrBuy", event.target.value as HireOrBuy)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="hire">Hire</option>
          <option value="buy">Buy</option>
          <option value="unsure">Unsure</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Headcount *</label>
        <input
          type="number"
          min={1}
          value={values.headcount}
          onChange={(event) => onChange("headcount", Number(event.target.value))}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
        <input
          value={values.location}
          onChange={onText("location")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="e.g. Gladstone, Moranbah"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
        <input
          value={values.duration}
          onChange={onText("duration")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="e.g. 4 months"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Power Access</label>
        <select
          value={values.powerAccess}
          onChange={(event) => onChange("powerAccess", event.target.value as PowerAccess)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="grid">Grid power available</option>
          <option value="generator">Generator planned</option>
          <option value="limited">Limited / off-grid</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Water Access</label>
        <select
          value={values.waterAccess}
          onChange={(event) => onChange("waterAccess", event.target.value as ServiceAccess)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Waste Access</label>
        <select
          value={values.wasteAccess}
          onChange={(event) => onChange("wasteAccess", event.target.value as ServiceAccess)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Would you like MBH to quote transport?</label>
        <select
          value={values.wantsTransportQuote}
          onChange={(event) => onChange("wantsTransportQuote", event.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="unsure">Unsure</option>
        </select>
      </div>

      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="flex items-center gap-2 p-3 border rounded-lg border-gray-200">
          <input
            type="checkbox"
            checked={values.needsOffice}
            onChange={(event) => onChange("needsOffice", event.target.checked)}
          />
          <span className="text-sm text-gray-700">Need office space</span>
        </label>

        <label className="flex items-center gap-2 p-3 border rounded-lg border-gray-200">
          <input
            type="checkbox"
            checked={values.needsCrib}
            onChange={(event) => onChange("needsCrib", event.target.checked)}
          />
          <span className="text-sm text-gray-700">Need crib / lunch room</span>
        </label>

        <label className="flex items-center gap-2 p-3 border rounded-lg border-gray-200">
          <input
            type="checkbox"
            checked={values.needsToilets}
            onChange={(event) => onChange("needsToilets", event.target.checked)}
          />
          <span className="text-sm text-gray-700">Need toilets / ablutions</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Site Access</label>
        <input
          value={values.siteAccess}
          onChange={onText("siteAccess")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Access roads, set-down area, crane space"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Known Site Constraints</label>
        <input
          value={values.siteConstraints}
          onChange={onText("siteConstraints")}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Height restrictions, overhead lines, terrain, obstacles"
        />
      </div>
    </div>
  );
}