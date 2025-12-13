import { useState } from "react";
import { Menu, PanelLeft, Search, Settings } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className={`h-screen bg-gray-900 text-white transition-all ${open ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className={`text-xl font-semibold ${!open && "hidden"}`}>RFQ Panel</h1>
        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      <div className="mt-4">
        <NavItem icon={<PanelLeft />} label="Dashboard" open={open} />
        <NavItem icon={<Search />} label="RFQ Search" open={open} />
        <NavItem icon={<Settings />} label="Settings" open={open} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, open }) {
  return (
    <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-gray-800">
      {icon}
      {open && <span>{label}</span>}
    </div>
  );
}
