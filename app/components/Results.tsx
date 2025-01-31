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
};

export default function Results({ items, people, tip, tax }: ResultsProps) {
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
    <div className="bg-gray-50 p-4 rounded-xl shadow-md min-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-indigo-800">
        Bill Split Results
      </h2>
      <div className="mb-6 space-y-2">
        <p className="flex justify-between">
          <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Tip:</span> <span>${tipAmount.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Tax:</span> <span>${taxAmount.toFixed(2)}</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>Total:</span> <span>${total.toFixed(2)}</span>
        </p>
      </div>
      <ul className="space-y-2 mb-6">
        {Object.entries(splitBill).map(([person, amount]) => (
          <li
            key={person}
            className="bg-white p-3 rounded-lg shadow flex justify-between items-center"
          >
            <span className="font-medium text-gray-800">{person}</span>
            <span className="text-indigo-600 font-semibold">
              ${amount.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
      <button
        onClick={copyToClipboard}
        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        {copySuccess ? "Copied!" : "Copy summary"}
      </button>
      {copySuccess && (
        <p className="text-green-600 text-center mt-2">
          Summary copied to clipboard!
        </p>
      )}
    </div>
  );
}
