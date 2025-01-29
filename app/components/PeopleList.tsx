import { useState } from "react"

type PeopleListProps = {
  people: string[]
  onAddPerson: (name: string) => void
}

export default function PeopleList({ people, onAddPerson }: PeopleListProps) {
  const [newPerson, setNewPerson] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPerson) {
      onAddPerson(newPerson)
      setNewPerson("")
    }
  }

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">People Splitting the Bill</h2>
      <form onSubmit={handleSubmit} className="mb-2">
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          className="p-2 border rounded mr-2"
          placeholder="Enter name"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Person
        </button>
      </form>
      {people.length === 0 ? (
        <p>No people added yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {people.map((person, index) => (
            <li key={index}>{person}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

