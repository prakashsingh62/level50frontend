import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-4 overflow-auto h-full bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
