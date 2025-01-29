type Item = {
  name: string;
  price: number;
  sharedBy: string[];
};

type ItemListProps = {
  items: Item[];
  onDeleteItem: (index: number) => void;
};

export default function ItemList({ items, onDeleteItem }: ItemListProps) {
  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-800">
        Receipt Items
      </h2>
      {items.length === 0 ? (
        <p className="text-gray-500 italic">No items added yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="bg-white p-3 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-indigo-600 font-semibold">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteItem(index)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={`Delete ${item.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Shared by: {item.sharedBy.join(", ")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
