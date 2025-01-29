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
      className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-800">
        Add Item to Receipt
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shared By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {people.map((person) => (
              <label key={person} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={sharedBy.includes(person)}
                  onChange={() => togglePerson(person)}
                  className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-700">{person}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Item
      </button>
    </form>
  );
}
