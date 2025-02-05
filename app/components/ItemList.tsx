import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

type Item = {
  name: string;
  price: number;
  sharedBy: string[];
};

type ItemListProps = {
  items: Item[];
  onDeleteItem: (index: number) => void;
  isProcessing?: boolean;
  processingError?: string | null;
  people: string[];
  onUpdateItemShares: (index: number, sharedBy: string[]) => void;
  onAddItem: (item: Item) => void;
};

export default function ItemList({
  items,
  onDeleteItem,
  isProcessing = false,
  processingError = null,
  people,
  onUpdateItemShares,
  onAddItem,
}: ItemListProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<{ name: string; price: string }>({
    name: "",
    price: "",
  });

  React.useEffect(() => {
    if (currentIndex >= items.length && items.length > 0) {
      setCurrentIndex(items.length - 1);
      setIsReviewMode(false);
    }
  }, [items.length, currentIndex]);

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsReviewMode(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddNewItem = () => {
    if (newItem.name && newItem.price) {
      onAddItem({
        name: newItem.name,
        price: parseFloat(newItem.price),
        sharedBy: [],
      });
      setNewItem({ name: "", price: "" });
      setIsAddingNew(false);
      setCurrentIndex(items.length); // Move to the newly added item
      setIsReviewMode(false);
    }
  };

  const handleDeleteItem = (index: number) => {
    onDeleteItem(index);
    if (isReviewMode && items.length <= 1) {
      setIsReviewMode(false);
    }
  };

  const renderItemCard = (
    item: Item,
    index: number,
    isFocused: boolean = false
  ) => (
    <motion.li
      key={index}
      initial={isFocused ? { opacity: 0, y: 20 } : { opacity: 1 }}
      animate={isFocused ? { opacity: 1, y: 0 } : { opacity: 0.6, scale: 0.95 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white p-4 rounded-xl shadow-sm border ${
        isFocused ? "border-indigo-200 shadow-lg" : "border-slate-100"
      } transition-colors`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <span className="text-lg text-slate-800 font-medium">
              {item.name}
            </span>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="font-serif text-xl text-indigo-600">
              ${item.price.toFixed(2)}
            </span>
            <button
              onClick={() => handleDeleteItem(index)}
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
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <p className="text-sm text-slate-500">Who's sharing this item?</p>
            <div className="flex flex-wrap gap-2">
              {people.map((person) => (
                <button
                  key={person}
                  onClick={() => {
                    const newSharedBy = item.sharedBy.includes(person)
                      ? item.sharedBy.filter((p) => p !== person)
                      : [...item.sharedBy, person];
                    onUpdateItemShares(index, newSharedBy);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    item.sharedBy.includes(person)
                      ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {person}
                  {item.sharedBy.includes(person) && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
            {item.sharedBy.length > 0 && (
              <div className="text-sm text-slate-500">
                Split between: {item.sharedBy.join(", ")}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.li>
  );

  const renderAddNewSection = () => (
    <motion.div
      key="add-new"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Item Name
        </label>
        <input
          type="text"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter item name"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">
          Price
        </label>
        <input
          type="number"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          step="0.01"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter price"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsAddingNew(false)}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleAddNewItem}
          disabled={!newItem.name || !newItem.price}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Item
        </button>
      </div>
    </motion.div>
  );

  if (isProcessing) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-500 text-lg">Processing receipt...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-3xl font-medium font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text">
          {isReviewMode ? "Review Items" : "Tag Items"}
        </h2>
        {!isReviewMode && items.length > 0 && !isAddingNew && (
          <div className="text-sm text-slate-500">
            Item {currentIndex + 1} of {items.length}
          </div>
        )}
      </div>

      {processingError && (
        <div className="mb-6">
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-600 text-lg mb-2">
              Error Processing Receipt
            </p>
            <p className="text-slate-500 mb-4">{processingError}</p>
          </div>
        </div>
      )}

      {items.length === 0 && !isAddingNew ? (
        <div className="text-center py-8">
          <p className="text-slate-500 text-lg mb-2">No items added yet</p>
          <p className="text-slate-400 mb-4">
            {processingError
              ? "Start by adding items manually"
              : "Add items manually or upload a receipt"}
          </p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
          >
            + Add Item
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {isReviewMode && !isAddingNew ? (
              <motion.ul
                key="review"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {items.map((item, index) => renderItemCard(item, index))}
              </motion.ul>
            ) : isAddingNew ? (
              renderAddNewSection()
            ) : (
              <motion.ul
                key="focus-mode"
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {items.map((item, index) =>
                  index === currentIndex
                    ? renderItemCard(item, index, true)
                    : null
                )}
              </motion.ul>
            )}
          </AnimatePresence>

          {!isAddingNew && (
            <div className="flex justify-between items-center pt-4">
              {isReviewMode ? (
                <div className="flex justify-end w-full gap-3">
                  <button
                    onClick={() => {
                      setIsReviewMode(false);
                      setCurrentIndex(items.length - 1);
                    }}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Back to Tagging
                  </button>
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    + Add More Items
                  </button>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {currentIndex === items.length - 1
                      ? "Review All"
                      : "Next →"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
