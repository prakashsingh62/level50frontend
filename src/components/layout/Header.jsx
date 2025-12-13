import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full h-14 border-b bg-white flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold">RFQ Management</h1>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search RFQs..."
          className="border rounded-md px-3 py-1 h-9"
        />

        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>

        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>
    </header>
  );
}
