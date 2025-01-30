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
  const [tip, setTip] = useState<{
    type: "percentage" | "amount";
    value: number;
  }>({ type: "percentage", value: 0 });
  const [tax, setTax] = useState<{
    type: "percentage" | "amount";
    value: number;
  }>({ type: "percentage", value: 0 });
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [isManual, setIsManual] = useState(false);
  const [step, setStep] = useState(0);

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
    setStep(4);
  };

  const resetApp = () => {
    setStep(0);
  };

  function handleReceiptUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setReceiptImage(event.target.files[0]);
      setStep(1);
    }
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => (prev > 0 ? prev - 1 : 0));
  }

  return (
    <div className="bg-gray-50 text-gray-800 p-2 sm:p-4 flex min-h-screen">
      <div className="w-full mx-auto bg-white rounded-md shadow-md p-2 sm:p-4">
        <div
          className={`p-4 sm:p-8 transition-opacity duration-500 justify-center items-center flex flex-col min-h-full ${
            step === 0 ? "opacity-100" : "opacity-100"
          }`}
        >
          {step === 0 && (
            <>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
                Splits
              </h1>
              <h3 className="text-2xl sm:text-xl font-semibold text-gray-600 mb-6">
                Upload Receipt Image
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100
          "
              />
              <button
                onClick={nextStep}
                className="mt-4 w-1/3 bg-gray-900 text-white flex items-center justify-center font-semibold py-2 px-4 rounded-md transition-all hover:bg-gray-700"
              >
                Next →
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <PeopleList
                people={people}
                onAddPerson={addPerson}
                onDeletePerson={deletePerson}
              />
              <button
                onClick={nextStep}
                className="mt-4 w-1/3 bg-gray-900 text-white flex items-center justify-center font-semibold py-2 px-4 rounded-md transition-all hover:bg-gray-700"
              >
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                className="mt-4 w-full bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-md hover:bg-gray-300 transition-colors"
                onClick={() => setIsManual(!isManual)}
              >
                {isManual ? "Collapse Manual Entry" : "Show Manual Entry"}
              </button>
              {isManual && <ReceiptForm onAddItem={addItem} people={people} />}
              <ItemList items={items} onDeleteItem={deleteItem} />
              <button
                onClick={prevStep}
                className="mt-8 w-1/3 bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="mt-4 w-1/3 bg-gray-900 text-white flex items-center justify-center font-semibold py-2 px-4 rounded-md transition-all hover:bg-gray-700"
              >
                Next →
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <TipTaxForm
                tip={tip}
                tax={tax}
                onTipChange={setTip}
                onTaxChange={setTax}
              />
              <button
                onClick={prevStep}
                className="mt-8 w-1/3 bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={calculateSplit}
                className="mt-4 w-1/3 bg-gray-900 text-white flex items-center justify-center font-semibold py-2 px-4 rounded-md transition-all hover:bg-gray-700"
              >
                Next →
              </button>
            </>
          )}

          {step === 4 && (
            <>
              <Results items={items} people={people} tip={tip} tax={tax} />
              <button
                onClick={resetApp}
                className="mt-6 w-1/3 bg-gray-200 text-gray-800 font-semibold py-4 px-8 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Start
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
