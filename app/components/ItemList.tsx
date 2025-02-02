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
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
      <h2 className="font-serif text-3xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text mb-6">
        Receipt Items
      </h2>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 text-lg mb-2">No items added yet</p>
          <p className="text-slate-400">
            Add items manually or upload a receipt
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-lg text-slate-800 font-medium">
                    {item.name}
                  </span>
                  <div className="text-slate-500 text-sm sm:text-base">
                    Shared by: {item.sharedBy.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="font-serif text-xl text-indigo-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onDeleteItem(index)}
                    className="p-2 -m-2 text-slate-400 hover:text-red-500 focus:outline-none transition-colors"
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
