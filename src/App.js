import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import JobsPage from "./pages/JobsPage";

function App() {
  const [activePage, setActivePage] = useState("jobs");

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
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />
      {renderPage()}
    </div>
  );
}

export default App;
