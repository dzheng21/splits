type Item = {
  name: string;
  price: number;
  sharedBy: string[];
};

type ResultsProps = {
  items: Item[];
  people: string[];
  tip: { type: "percentage" | "amount"; value: number };
  tax: { type: "percentage" | "amount"; value: number };
  onBack: () => void;
  onReset: () => void;
  vendorInfo?: { name: string; date: string } | null;
};

export default function Results({
  items,
  people,
  tip,
  tax,
  onBack,
  onReset,
  vendorInfo,
}: ResultsProps) {
  // ... existing calculateSplit function ...

  const generateSummary = () => {
    let summary = "🧾 Bill Split Summary 🧾\n\n";
    if (vendorInfo) {
      summary += `${vendorInfo.name}\n`;
      summary += `Date: ${vendorInfo.date}\n\n`;
    }
    summary += "Items:\n";
    // ... rest of the existing generateSummary code ...
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
      <h2 className="font-serif text-3xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text mb-2">
        Split Results
      </h2>
      {vendorInfo && (
        <div className="mb-6">
          <h3 className="text-xl text-slate-800 font-medium">
            {vendorInfo.name}
          </h3>
          <p className="text-slate-500">{vendorInfo.date}</p>
        </div>
      )}
      // ... rest of the existing JSX ...
    </div>
  );
}
