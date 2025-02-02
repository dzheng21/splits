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
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-200/50">
      <h2 className="font-serif text-3xl font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text mb-6">
        Who's Splitting?
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 mb-6"
      >
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          className="flex-grow px-4 py-4 sm:py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-lg"
          placeholder="Enter name"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg px-6 py-4 sm:py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Add Person
        </button>
      </form>
      {people.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 text-lg mb-2">No people added yet</p>
          <p className="text-slate-400">Add someone to get started</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {people.map((person, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group hover:border-slate-200 transition-colors"
            >
              <span className="text-lg text-slate-700">{person}</span>
              <button
                onClick={() => onDeletePerson(person)}
                className="p-2 -m-2 text-slate-400 hover:text-red-500 focus:outline-none transition-colors"
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
