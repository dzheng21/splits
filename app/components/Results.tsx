import { useState } from "react";

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
};

export default function Results({
  items,
  people,
  tip,
  tax,
  onBack,
  onReset,
}: ResultsProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const calculateSplit = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);

    const tipAmount =
      tip.type === "percentage" ? subtotal * (tip.value / 100) : tip.value;
    const taxAmount =
      tax.type === "percentage" ? subtotal * (tax.value / 100) : tax.value;

    const total = subtotal + tipAmount + taxAmount;

    const splitBill: Record<string, number> = {};
    people.forEach((person) => {
      splitBill[person] = 0;
    });

    items.forEach((item) => {
      const itemTotal =
        item.price + (item.price / subtotal) * (tipAmount + taxAmount);
      const splitAmount = itemTotal / item.sharedBy.length;
      item.sharedBy.forEach((person) => {
        splitBill[person] += splitAmount;
      });
    });

    return { splitBill, subtotal, tipAmount, taxAmount, total };
  };

  const { splitBill, subtotal, tipAmount, taxAmount, total } = calculateSplit();

  const generateSummary = () => {
    let summary = "🧾 Bill Split Summary 🧾\n\n";
    summary += "Items:\n";
    items.forEach((item) => {
      summary += `- ${item.name}: $${item.price.toFixed(
        2
      )} (Shared by: ${item.sharedBy.join(", ")})\n`;
    });
    summary += `\nSubtotal: $${subtotal.toFixed(2)}\n`;
    summary += `Tip: $${tipAmount.toFixed(2)}\n`;
    summary += `Tax: $${taxAmount.toFixed(2)}\n`;
    summary += `Total: $${total.toFixed(2)}\n`;
    summary += "\nSplit:\n";
    Object.entries(splitBill).forEach(([person, amount]) => {
      summary += `${person}: $${amount.toFixed(2)}\n`;
    });
    return summary;
  };

  const copyToClipboard = async () => {
    const summary = generateSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
      <h2 className="font-serif text-3xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text mb-6">
        Split Results
      </h2>
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-100 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-base sm:text-lg text-slate-600">
            <span>Subtotal</span>
            <span className="font-serif">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-base sm:text-lg text-slate-600">
            <span>Tip</span>
            <span className="font-serif">${tipAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-base sm:text-lg text-slate-600">
            <span>Tax</span>
            <span className="font-serif">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between items-center text-lg sm:text-xl text-slate-800">
            <span className="font-medium">Total</span>
            <span className="font-serif">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="space-y-3 mb-6">
        {Object.entries(splitBill).map(([person, amount]) => (
          <div
            key={person}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0"
          >
            <span className="text-base sm:text-lg text-slate-800">
              {person}
            </span>
            <span className="font-serif text-lg sm:text-xl text-indigo-600">
              ${amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={copyToClipboard}
          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg px-6 py-4 sm:py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
        >
          {copySuccess ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy Summary
            </>
          )}
        </button>
        {copySuccess && (
          <p className="text-center text-indigo-600">
            Summary copied to clipboard!
          </p>
        )}
        <div className="flex flex-row justify-between w-full gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="transform transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Back
          </button>
          <button
            onClick={onReset}
            className="group px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            New Split
          </button>
        </div>
      </div>
    </div>
  );
}
