"use client"

import { useState } from "react"
import ReceiptForm from "./components/ReceiptForm"
import ItemList from "./components/ItemList"
import PeopleList from "./components/PeopleList"
import Results from "./components/Results"

export default function Home() {
  const [items, setItems] = useState<Array<{ name: string; price: number; sharedBy: string[] }>>([])
  const [people, setPeople] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const addItem = (item: { name: string; price: number; sharedBy: string[] }) => {
    setItems([...items, item])
  }

  const addPerson = (name: string) => {
    setPeople([...people, name])
  }

  const calculateSplit = () => {
    setShowResults(true)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bill Split App</h1>
      {!showResults ? (
        <>
          <ReceiptForm onAddItem={addItem} people={people} />
          <ItemList items={items} />
          <PeopleList people={people} onAddPerson={addPerson} />
          <button
            onClick={calculateSplit}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Calculate Split
          </button>
        </>
      ) : (
        <Results items={items} people={people} />
      )}
    </div>
  )
}

