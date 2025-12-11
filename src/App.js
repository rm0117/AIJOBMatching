import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobsPage from "./pages/JobsPage";

function App() {
  const [activePage, setActivePage] = useState("jobs");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { key: "jobs", label: "案件一覧表示" },
    { key: "members", label: "要員一覧表示" },
    { key: "stats", label: "統計情報" }
  ];

  const renderPage = () => {
    switch (activePage) {
      case "jobs":
        return <JobsPage />;
      case "members":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-xl font-bold mb-4">要員一覧</h2>
            <p className="text-sm text-slate-600">
              要員一覧ページはこれから実装します。
            </p>
          </div>
        );
      case "stats":
        return (
          <div className="flex-1 p-6">
            <h2 className="text-xl font-bold mb-4">統計情報</h2>
            <p className="text-sm text-slate-600">
              統計情報ページはこれから実装します。
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-root flex min-h-screen bg-slate-100">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />

      <div className="flex-1 flex flex-col">
        {/* Mobile menu button and dropdown */}
        <div className="mobile-menu-container md:hidden bg-slate-900 text-white p-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white font-bold text-lg"
          >
            ☰ メニュー
          </button>
          {mobileMenuOpen && (
            <div className="mobile-dropdown mt-2 bg-slate-800 rounded">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActivePage(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    activePage === item.key
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
