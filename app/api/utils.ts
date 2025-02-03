export type ReceiptItem = {
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes?: string;
};

export type AdditionalCharge = {
  charge_name: string;
  amount: number;
};

export type Receipt = {
  vendor_info: {
    name: string;
    location?: string;
    date: string;
    time?: string;
  };
  line_items: ReceiptItem[];
  additional_charges: AdditionalCharge[];
  totals: {
    subtotal: number;
    tax: number;
    tip?: number;
    tip_percentage?: number;
    total: number;
  };
};

export const receiptExtractionPrompt = `
Extract detailed information from receipt images, including itemized entries and totals, and provide the data in a structured JSON format.

Understand that receipts can vary significantly in format and may come from different types of vendors (restaurants, retail stores, services). The goal is to capture both the overall receipt details and individual line items accurately.

Key Components to Extract:

- **Receipt Header**:
  - Vendor name and location
  - Transaction date and time

- **Line Items**:
  For each item on the receipt:
  - Item name/description
  - Quantity
  - Unit price
  - Item subtotal

- **Additional Charges**:
  Examples: Service charges, Kitchen/processing fees, Delivery fees, Platform fees, Any other miscellaneous charges
  - Charge name
  - Amount

- **Totals Section**:
  - Subtotal (before tax/fees)
  - Tax amount
  - Tip amount (if applicable)
  - Tip percentage (if applicable)
  - Final total

# Output Format

The extracted information should be returned in the following JSON format:

\`\`\`json
{
  "vendor_info": {
    "name": "[Vendor Name]",
    "location": "[Location if available]",
    "date": "[Transaction Date]",
    "time": "[Transaction Time]",
  },
  "line_items": [
    {
      "item_name": "[Item Description]",
      "quantity": "[Quantity]",
      "unit_price": "[Price per Unit]",
      "subtotal": "[Item Subtotal]",
      "notes": "[Any modifiers or special instructions]"
    }
  ],
  "additional_charges": [
    {
      "charge_name": "[Name of Fee/Charge]",
      "amount": "[Amount]"
    }
  ],
  "totals": {
    "subtotal": "[Subtotal before tax/fees]",
    "tax": "[Tax Amount]",
    "tip": "[Tip Amount if applicable]",
    "tip_percentage": "[Tip Percentage if applicable]",
    "total": "[Final Total]"
  }
}
\`\`\`

# Notes

- All monetary values should be returned as decimal numbers without currency symbols
- Quantities should be numeric integer values
- If an item's quantity is not explicitly stated, assume 1
- For missing or unclear values, provide null rather than making assumptions
- Capture any special instructions or modifiers in the line item's "notes" field
- If multiple taxes or fees exist, list each separately in additional_charges
`;
