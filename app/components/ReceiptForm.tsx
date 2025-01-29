import { useState } from "react"

type ReceiptFormProps = {
  onAddItem: (item: { name: string; price: number; sharedBy: string[] }) => void
  people: string[]
}

export default function ReceiptForm({ onAddItem, people }: ReceiptFormProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [sharedBy, setSharedBy] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && price && sharedBy.length > 0) {
      onAddItem({ name, price: Number.parseFloat(price), sharedBy })
      setName("")
      setPrice("")
      setSharedBy([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="text-xl font-bold mb-2">Add Item to Receipt</h2>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block mb-1">Item Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border rounded"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label className="block mb-1">Shared By</label>
          <select
            multiple
            value={sharedBy}
            onChange={(e) => setSharedBy(Array.from(e.target.selectedOptions, (option) => option.value))}
            className="w-full p-2 border rounded"
            required
          >
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Add Item
      </button>
    </form>
  )
}

