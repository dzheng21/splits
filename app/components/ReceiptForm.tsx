import { useState } from "react";

type ReceiptFormProps = {
  onAddItem: (item: {
    name: string;
    price: number;
    sharedBy: string[];
  }) => void;
  people: string[];
};

export default function ReceiptForm({ onAddItem, people }: ReceiptFormProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [sharedBy, setSharedBy] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && price && sharedBy.length > 0) {
      onAddItem({ name, price: Number.parseFloat(price), sharedBy });
      setName("");
      setPrice("");
      setSharedBy([]);
    }
  };

  const togglePerson = (person: string) => {
    setSharedBy((prev) =>
      prev.includes(person)
        ? prev.filter((p) => p !== person)
        : [...prev, person]
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50 mt-4"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text mb-6">
        Add Item
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Shared By
          </label>
          <div className="grid grid-cols-2 gap-3">
            {people.map((person) => (
              <label
                key={person}
                className="flex items-center p-3 bg-white border border-slate-200 rounded-xl cursor-pointer transition-colors hover:border-indigo-200"
              >
                <input
                  type="checkbox"
                  checked={sharedBy.includes(person)}
                  onChange={() => togglePerson(person)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-3 text-slate-700">{person}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Item
      </button>
    </form>
  );
}
