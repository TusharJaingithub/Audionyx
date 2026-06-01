import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children, searchTerm, setSearchTerm, onSearch }) {
  return (
    <div className="flex flex-col md:flex-row bg-black h-screen overflow-hidden">
        <Sidebar />

      <div className="flex-1 min-h-0 bg-linear-to-b from-zinc-900 to-black flex flex-col">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={onSearch}
        />

        <div className="p-2 md:p-4 pb-36 md:pb-44 min-h-0 flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
