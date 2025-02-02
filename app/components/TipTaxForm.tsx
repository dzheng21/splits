import { useState } from "react";

type TipTaxFormProps = {
  tip: { type: "percentage" | "amount"; value: number };
  tax: { type: "percentage" | "amount"; value: number };
  onTipChange: (tip: { type: "percentage" | "amount"; value: number }) => void;
  onTaxChange: (tax: { type: "percentage" | "amount"; value: number }) => void;
};

export default function TipTaxForm({
  tip,
  tax,
  onTipChange,
  onTaxChange,
}: TipTaxFormProps) {
  const [tipType, setTipType] = useState<"percentage" | "amount">(tip.type);
  const [taxType, setTaxType] = useState<"percentage" | "amount">(tax.type);
  const [tipError, setTipError] = useState("");
  const [taxError, setTaxError] = useState("");

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value);
    onTipChange({ type: tipType, value: isNaN(value) ? 0 : value });
    if (tipType === "percentage" && value > 100) {
      setTipError("Are you sure? Tip exceeds 100%");
    } else {
      setTipError("");
    }
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value);
    onTaxChange({ type: taxType, value: isNaN(value) ? 0 : value });
    if (taxType === "percentage" && value > 100) {
      setTaxError("Are you sure? Tax exceeds 100%");
    } else {
      setTaxError("");
    }
  };

  const toggleTipType = () => {
    const newType = tipType === "percentage" ? "amount" : "percentage";
    setTipType(newType);
    onTipChange({ type: newType, value: 0 });
  };

  const toggleTaxType = () => {
    const newType = taxType === "percentage" ? "amount" : "percentage";
    setTaxType(newType);
    onTaxChange({ type: newType, value: 0 });
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
      <h2 className="font-serif text-3xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text mb-6">
        Add Tip & Tax
      </h2>
      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg text-slate-700">Tip</label>
            <button
              onClick={toggleTipType}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span
                className={
                  tipType === "percentage"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }
              >
                %
              </span>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  tipType === "percentage" ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    tipType === "percentage" ? "translate-x-0" : "translate-x-6"
                  }`}
                />
              </div>
              <span
                className={
                  tipType === "amount" ? "text-indigo-600" : "text-slate-400"
                }
              >
                $
              </span>
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={tip.value === 0 ? "" : tip.value}
              onChange={handleTipChange}
              min="0"
              step={tipType === "percentage" ? "1" : "0.01"}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-lg"
              placeholder={
                tipType === "percentage"
                  ? "Enter tip percentage"
                  : "Enter tip amount"
              }
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {tipType === "percentage" ? "%" : "$"}
            </div>
          </div>
          {tipError && (
            <p className="mt-2 text-red-500 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {tipError}
            </p>
          )}
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg text-slate-700">Tax</label>
            <button
              onClick={toggleTaxType}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span
                className={
                  taxType === "percentage"
                    ? "text-indigo-600"
                    : "text-slate-400"
                }
              >
                %
              </span>
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  taxType === "percentage" ? "bg-indigo-600" : "bg-slate-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    taxType === "percentage" ? "translate-x-0" : "translate-x-6"
                  }`}
                />
              </div>
              <span
                className={
                  taxType === "amount" ? "text-indigo-600" : "text-slate-400"
                }
              >
                $
              </span>
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={tax.value === 0 ? "" : tax.value}
              onChange={handleTaxChange}
              min="0"
              step={taxType === "percentage" ? "1" : "0.01"}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-lg"
              placeholder={
                taxType === "percentage"
                  ? "Enter tax percentage"
                  : "Enter tax amount"
              }
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {taxType === "percentage" ? "%" : "$"}
            </div>
          </div>
          {taxError && (
            <p className="mt-2 text-red-500 flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {taxError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
