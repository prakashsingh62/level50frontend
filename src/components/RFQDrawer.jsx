import { useState, useMemo } from "react";

export default function RFQDrawer({ row, onClose }) {
  const [ignoreOverdue, setIgnoreOverdue] = useState(false);

  if (!row) return null;

  // Utility convert DD/MM/YYYY → Date object
  function parseDate(ddmmyyyy) {
    if (!ddmmyyyy) return null;
    const [d, m, y] = ddmmyyyy.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  // Format Date → DD/MM/YYYY
  function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date)) return "-";
    return String(date.getDate()).padStart(2, "0") + "/" +
      String(date.getMonth() + 1).padStart(2, "0") + "/" +
      date.getFullYear();
  }

  const today = new Date();

  // Extract dates from row
  const dueDate = parseDate(row.due_date);
  const lastFollowup = parseDate(row.followup_date);

  // Helper to add days
  function addDays(date, days) {
    const x = new Date(date);
    x.setDate(x.getDate() + days);
    return x;
  }

  // Vendor pending logic
  const vendorPending =
    row["VENDOR QUOTATION STATUS"] &&
    row["VENDOR QUOTATION STATUS"].toLowerCase().includes("pending");

  // Customer silent logic
  const customerSilent =
    lastFollowup &&
    ((today - lastFollowup) / (1000 * 60 * 60 * 24)) >= 5;

  // High-value logic (>= ₹5,00,000)
  const highValue =
    row["VEPL OFFER VALUE"] &&
    Number(row["VEPL OFFER VALUE"]) >= 500000;

  // Overdue logic
  const overdue =
    dueDate && dueDate < today.setHours(0,0,0,0);

  // SMART NEXT-FOLLOWUP CALCULATION (Display Only)
  const nextFollowup = useMemo(() => {
    // 1. Overdue case (urgent)
    if (overdue && !ignoreOverdue) {
      return today;
    }

    // 2. High-value → next day
    if (highValue) {
      return addDays(today, 1);
    }

    // 3. Vendor pending → 2 days
    if (vendorPending) {
      return addDays(today, 2);
    }

    // 4. Customer silent → today
    if (customerSilent) {
      return today;
    }

    // 5. Normal RFQ → every 3 days
    return addDays(today, 3);
  }, [row, ignoreOverdue]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-50">

      {/* Drawer Panel */}
      <div className="w-[420px] h-full bg-white shadow-xl p-6 overflow-y-auto animate-slideIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">RFQ Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* BASIC INFO */}
        <section className="space-y-2 mb-4">
          <Field label="RFQ Number" value={row["RFQ NO"]} />
          <Field label="Customer" value={row["CUSTOMER NAME"]} />
          <Field label="Status" value={row["CURRENT STATUS"]} />
          <Field label="Offer Value" value={row["VEPL OFFER VALUE"]} />
        </section>

        <hr className="my-4" />

        {/* FOLLOW-UP SECTION */}
        <h3 className="text-lg font-semibold mb-2">Follow-up</h3>

        <div className="space-y-2">

          {/* LAST FOLLOWUP */}
          <Field label="Last Follow-up Date" value={row.followup_date} />

          {/* IGNORE OVERDUE TOGGLE */}
          <div className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              checked={ignoreOverdue}
              onChange={() => setIgnoreOverdue(!ignoreOverdue)}
            />
            <label className="text-sm text-gray-600">
              Ignore overdue rule for this RFQ
            </label>
          </div>

          {/* RECOMMENDED NEXT FOLLOWUP */}
          <Field
            label="Recommended Next Follow-up"
            value={formatDate(nextFollowup)}
          />
        </div>

        <hr className="my-4" />

        {/* DATES SECTION */}
        <h3 className="text-lg font-semibold mb-2">Dates</h3>
        <div className="space-y-2">
          <Field label="RFQ Date" value={row.rfq_date} />
          <Field label="UID Date" value={row.uid_date} />
          <Field label="Due Date" value={row.due_date} />
          <Field label="Vendor Quotation Date" value={row.vendor_quotation_date} />
        </div>

        <hr className="my-4" />

        {/* VENDOR SECTION */}
        {row["VENDOR NAME"] && (
          <>
            <h3 className="text-lg font-semibold mb-2">Vendor Details</h3>
            <div className="space-y-2">
              <Field label="Vendor" value={row["VENDOR NAME"]} />
              <Field label="Contact" value={row["CONTACT PERSON"]} />
              <Field label="Phone" value={row["PHONE NO"]} />
              <Field label="Email" value={row["EMAIL ID"]} />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* Helper Field Component */
function Field({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}
