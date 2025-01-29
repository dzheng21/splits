type Item = {
  name: string
  price: number
  sharedBy: string[]
}

type ResultsProps = {
  items: Item[]
  people: string[]
}

export default function Results({ items, people }: ResultsProps) {
  const calculateSplit = () => {
    const splitBill: Record<string, number> = {}
    people.forEach((person) => {
      splitBill[person] = 0
    })

    items.forEach((item) => {
      const splitAmount = item.price / item.sharedBy.length
      item.sharedBy.forEach((person) => {
        splitBill[person] += splitAmount
      })
    })

    return splitBill
  }

  const splitBill = calculateSplit()

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Bill Split Results</h2>
      <ul className="list-disc pl-5">
        {Object.entries(splitBill).map(([person, amount]) => (
          <li key={person}>
            {person}: ${amount.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  )
}

