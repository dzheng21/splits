type Item = {
  name: string
  price: number
  sharedBy: string[]
}

type ItemListProps = {
  items: Item[]
}

export default function ItemList({ items }: ItemListProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Receipt Items</h2>
      {items.length === 0 ? (
        <p>No items added yet.</p>
      ) : (
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price.toFixed(2)} (Shared by: {item.sharedBy.join(", ")})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

