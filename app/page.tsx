"use client";

import { useState } from "react";
import ReceiptForm from "./components/ReceiptForm";
import ItemList from "./components/ItemList";
import PeopleList from "./components/PeopleList";
import Results from "./components/Results";
import TipTaxForm from "./components/TipTaxForm";

export default function Home() {
  const [items, setItems] = useState<
    Array<{ name: string; price: number; sharedBy: string[] }>
  >([]);
  const [people, setPeople] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [tip, setTip] = useState({ type: "percentage", value: 0 });
  const [tax, setTax] = useState({ type: "percentage", value: 0 });

  const addItem = (item: {
    name: string;
    price: number;
    sharedBy: string[];
  }) => {
    setItems([...items, item]);
  };

  const addPerson = (name: string) => {
    setPeople([...people, name]);
  };

  const deletePerson = (nameToDelete: string) => {
    setPeople(people.filter((name) => name !== nameToDelete));
    setItems(
      items.map((item) => ({
        ...item,
        sharedBy: item.sharedBy.filter((name) => name !== nameToDelete),
      }))
    );
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSplit = () => {
    setShowResults(true);
  };

  const resetApp = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
            Splits
          </h1>
          {!showResults ? (
            <>
              <div className="space-y-8">
                <PeopleList
                  people={people}
                  onAddPerson={addPerson}
                  onDeletePerson={deletePerson}
                />
                <ReceiptForm onAddItem={addItem} people={people} />
                <ItemList items={items} onDeleteItem={deleteItem} />
                <TipTaxForm
                  tip={tip}
                  tax={tax}
                  onTipChange={setTip}
                  onTaxChange={setTax}
                />
              </div>
              <button
                onClick={calculateSplit}
                className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Calculate Split
              </button>
            </>
          ) : (
            <>
              <Results items={items} people={people} tip={tip} tax={tax} />
              <button
                onClick={resetApp}
                className="mt-6 w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Back to Bill Splitting
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
