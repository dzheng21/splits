"use client";

import { useState } from "react";
import ReceiptForm from "./components/ReceiptForm";
import ItemList from "./components/ItemList";
import PeopleList from "./components/PeopleList";
import Results from "./components/Results";
import TipTaxForm from "./components/TipTaxForm";
import DragAndDropUploader from "./components/DragAndDropUploader";
import { ChevronDown, ChevronUp } from "./components/utils";

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
  const [isLoading, setIsLoading] = useState(false);

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

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async function handleReceiptUpload(files: FileList) {
    if (files.length > 0) {
      setIsLoading(true);
      try {
        const base64File = await fileToBase64(files[0]);
        // Call vision provider or API endpoint with base64File
      } finally {
        setIsLoading(false);
      }
      setStep(1);
    }
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => (prev > 0 ? prev - 1 : 0));
  }

  const navigationButtons = (
    <div className="flex flex-row justify-between w-full">
      <button
        onClick={prevStep}
        className="mt-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
      >
        Back
      </button>
      <button
        onClick={nextStep}
        className="mt-2 bg-gray-900 text-white flex font-semibold justify-center py-2 px-4 rounded-md transition-all hover:bg-gray-700"
      >
        →
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 text-gray-800 p-2 sm:p-4 flex min-h-screen">
      <div className="w-full mx-auto bg-white rounded-md shadow-md p-2 sm:p-4">
        <div
          className={`p-1 sm:p-2 transition-opacity duration-500 justify-start pt-20 items-center flex flex-col min-h-full ${
            step === 0 ? "opacity-100" : "opacity-100"
          }`}
        >
          {step === 0 && (
            <>
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
                Splits
              </h1>
              <h3 className="text-xl sm:text-l font-semibold text-gray-600 mb-6">
                Upload Receipt Image
              </h3>
              <DragAndDropUploader onFilesUploaded={handleReceiptUpload} />
              <div className="flex flex-row justify-end w-full">
                <button
                  onClick={nextStep}
                  className="mt-2 bg-gray-900 text-white flex font-semibold justify-center py-2 px-4 rounded-md transition-all hover:bg-gray-700"
                >
                  →
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <PeopleList
                people={people}
                onAddPerson={addPerson}
                onDeletePerson={deletePerson}
              />
              {navigationButtons}
            </>
          )}

          {step === 2 && (
            <>
              {isLoading && <div className="mt-2">Processing receipt...</div>}
              <ItemList items={items} onDeleteItem={deleteItem} />
              <button
                className="mt-4 w-1/2 text-navy-800 font-semibold py-4 px-8 rounded-md transition-colors"
                onClick={() => setIsManual(!isManual)}
              >
                {isManual ? "- hide" : "+ add more"}
              </button>
              {isManual && <ReceiptForm onAddItem={addItem} people={people} />}
              {navigationButtons}
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
              {navigationButtons}
            </>
          )}

          {step === 4 && (
            <>
              <Results items={items} people={people} tip={tip} tax={tax} />
              <button
                onClick={resetApp}
                className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to start
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
