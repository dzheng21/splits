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

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value);
    onTipChange({ type: tipType, value: isNaN(value) ? 0 : value });
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : Number.parseFloat(e.target.value);
    onTaxChange({ type: taxType, value: isNaN(value) ? 0 : value });
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-800">
        Tip and Tax
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tip
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={tipType}
              onChange={(e) => {
                setTipType(e.target.value as "percentage" | "amount");
                onTipChange({
                  type: e.target.value as "percentage" | "amount",
                  value: 0,
                });
              }}
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="percentage">Percentage</option>
              <option value="amount">Amount</option>
            </select>
            <input
              type="number"
              value={tip.value === 0 ? "" : tip.value}
              onChange={handleTipChange}
              min="0"
              step={tipType === "percentage" ? "1" : "0.01"}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={tipType === "percentage" ? "Enter %" : "Enter $"}
            />
            <span>{tipType === "percentage" ? "%" : "$"}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax
          </label>
          <div className="flex items-center space-x-2">
            <select
              value={taxType}
              onChange={(e) => {
                setTaxType(e.target.value as "percentage" | "amount");
                onTaxChange({
                  type: e.target.value as "percentage" | "amount",
                  value: 0,
                });
              }}
              className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="percentage">Percentage</option>
              <option value="amount">Amount</option>
            </select>
            <input
              type="number"
              value={tax.value === 0 ? "" : tax.value}
              onChange={handleTaxChange}
              min="0"
              step={taxType === "percentage" ? "1" : "0.01"}
              className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={taxType === "percentage" ? "Enter %" : "Enter $"}
            />
            <span>{taxType === "percentage" ? "%" : "$"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
