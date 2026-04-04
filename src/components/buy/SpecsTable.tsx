interface SpecsTableProps {
  specs: Record<string, string>;
}

export default function SpecsTable({ specs }: SpecsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-gray-900">Full Specifications</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex justify-between px-4 py-2.5">
            <span className="text-xs text-gray-500 font-medium">{key}</span>
            <span className="text-xs text-gray-900 font-semibold text-right max-w-[55%]">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
