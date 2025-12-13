export default function Topbar() {
  return (
    <div className="w-full h-16 bg-white shadow flex items-center px-6 justify-between">
      <h2 className="text-lg font-semibold">RFQ Dashboard</h2>

      <div className="flex gap-4 items-center">
        <span className="text-gray-600 text-sm">Welcome</span>
      </div>
    </div>
  );
}
