"use client";

import { useState } from "react";
import ReceiptForm from "./components/ReceiptForm";
import ItemList from "./components/ItemList";
import PeopleList from "./components/PeopleList";
import Results from "./components/Results";
import TipTaxForm from "./components/TipTaxForm";
import DragAndDropUploader from "./components/DragAndDropUploader";
import gpt4oProvider from "./api/VisionProvider";

// Font imports
import { EB_Garamond, Inter } from "next/font/google";

const garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-garamond",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
  const [isProcessingReceipt, setIsProcessingReceipt] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [vendorInfo, setVendorInfo] = useState<{
    name: string;
    date: string;
  } | null>(null);

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

  const updateItemShares = (index: number, sharedBy: string[]) => {
    setItems(
      items.map((item, i) => (i === index ? { ...item, sharedBy } : item))
    );
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

  const processReceiptResponse = (data: any) => {
    // Extract vendor information
    if (data.vendor_info) {
      setVendorInfo({
        name: data.vendor_info.name || "Unknown Vendor",
        date: data.vendor_info.date || new Date().toLocaleDateString(),
      });
    }

    // Extract line items
    const processedItems =
      data.line_items?.map((item: any) => ({
        name: item.item_name,
        price: Number(item.subtotal || item.unit_price || 0),
        sharedBy: [], // Initially empty, will be filled when people are added
      })) || [];

    // Set initial tax if present
    if (data.totals?.tax) {
      const subtotal =
        data.totals.subtotal ||
        processedItems.reduce(
          (sum: number, item: { price: number }) => sum + item.price,
          0
        );
      const taxValue = Number(data.totals.tax);
      setTax({
        type: "percentage",
        value: (taxValue / subtotal) * 100,
      });
    }

    // Set initial tip if present
    if (data.totals?.tip) {
      const tipValue = Number(data.totals.tip);
      const tipPercentage = data.totals.tip_percentage;
      setTip({
        type: tipPercentage ? "percentage" : "amount",
        value: tipPercentage || tipValue,
      });
    }

    setItems(processedItems);
  };

  async function handleReceiptUpload(files: FileList) {
    if (files.length > 0) {
      setIsProcessingReceipt(true);
      setProcessingError(null);

      // Move to the next step immediately
      setStep(1);

      try {
        const base64File = await fileToBase64(files[0]);
        const base64Data = base64File.split(",")[1] || base64File;

        const result = await gpt4oProvider(base64Data);
        console.log("Vision API Response:", result);

        if (result.success && result.data) {
          processReceiptResponse(result.data);
          console.log("Successfully processed receipt:", result.data);
        } else {
          setProcessingError(result.error || "Failed to process receipt");
          console.error("Failed to process receipt:", result.error);
        }
      } catch (error) {
        setProcessingError((error as Error).message);
        console.error("Error processing receipt:", error);
      } finally {
        setIsProcessingReceipt(false);
      }
    }
  }

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => (prev > 0 ? prev - 1 : 0));
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 p-4 sm:p-6 flex ${garamond.variable} ${inter.variable} font-sans`}
    >
      <div className="w-full max-w-4xl mx-auto">
        <div
          className={`transition-all duration-500 ease-in-out ${
            step === 0 ? "pt-12 sm:pt-20" : "pt-8 sm:pt-12"
          }`}
        >
          {step === 0 && (
            <div className="w-full max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="font-serif text-5xl sm:text-6xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text pb-2 bg-opacity-75">
                  splits
                </h1>
                <p className="text-slate-400 font-sm text-sm">
                  Split bills effortlessly with friends
                </p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
                <h3 className="text-2xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text font-semibold mb-6">
                  Upload Receipt Image
                </h3>
                <DragAndDropUploader onFilesUploaded={handleReceiptUpload} />
                <div className="flex flex-row justify-end w-full mt-6">
                  <button
                    onClick={nextStep}
                    className="group bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
                  >
                    Continue
                    <span className="transform transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="w-full max-w-2xl mx-auto">
              <PeopleList
                people={people}
                onAddPerson={addPerson}
                onDeletePerson={deletePerson}
              />
              <div className="flex flex-row justify-between w-full mt-6 gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span className="transform transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="group bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
                >
                  Continue
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-full max-w-2xl mx-auto">
              {isLoading && (
                <div className="mb-4 p-4 bg-indigo-50 text-indigo-700 rounded-xl flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing receipt...
                </div>
              )}
              <ItemList
                items={items}
                onDeleteItem={deleteItem}
                isProcessing={isProcessingReceipt}
                processingError={processingError}
                people={people}
                onUpdateItemShares={updateItemShares}
                onAddItem={addItem}
              />
              {/* <button
                className="mt-6 w-full text-slate-600 font-medium py-4 px-6 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsManual(!isManual)}
              >
                {isManual ? (
                  <>
                    <span className="text-lg">−</span> Hide manual entry
                  </>
                ) : (
                  <>
                    <span className="text-lg">+</span> Add items manually
                  </>
                )}
              </button> */}
              {isManual && <ReceiptForm onAddItem={addItem} people={people} />}
              <div className="flex flex-row justify-between w-full mt-6 gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span className="transform transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="group bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
                >
                  Continue
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full max-w-2xl mx-auto">
              <TipTaxForm
                tip={tip}
                tax={tax}
                onTipChange={setTip}
                onTaxChange={setTax}
              />
              <div className="flex flex-row justify-between w-full mt-6 gap-4">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span className="transform transition-transform group-hover:-translate-x-1">
                    ←
                  </span>
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="group bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2"
                >
                  Calculate Split
                  <span className="transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="w-full max-w-2xl mx-auto">
              <Results
                items={items}
                people={people}
                tip={tip}
                tax={tax}
                onBack={prevStep}
                onReset={resetApp}
                vendorInfo={vendorInfo}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
