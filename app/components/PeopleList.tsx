import { useState } from "react";

type PeopleListProps = {
  people: string[];
  onAddPerson: (name: string) => void;
  onDeletePerson: (name: string) => void;
};

export default function PeopleList({
  people,
  onAddPerson,
  onDeletePerson,
}: PeopleListProps) {
  const [newPerson, setNewPerson] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPerson && !people.includes(newPerson)) {
      onAddPerson(newPerson);
      setNewPerson("");
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-8 m-2 rounded-xl shadow-md w-full mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-800">
        People Splitting the Bill
      </h2>
      <form onSubmit={handleSubmit} className="flex mb-4">
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter name"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </form>
      {people.length === 0 ? (
        <p className="text-gray-500 italic">No people added yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {people.map((person, index) => (
            <li
              key={index}
              className="bg-white p-2 rounded-lg shadow flex justify-between items-center"
            >
              <span>{person}</span>
              <button
                onClick={() => onDeletePerson(person)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label={`Delete ${person}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
