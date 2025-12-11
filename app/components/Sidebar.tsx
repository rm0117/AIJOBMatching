interface SidebarProps {
  activePage: string;
  onChangePage: (page: string) => void;
}

export default function Sidebar({ activePage, onChangePage }: SidebarProps) {
  const itemClass = (key: string) =>
    `w-full text-left px-3 py-2 rounded mb-2 text-sm ${
      activePage === key
        ? "bg-slate-100 text-slate-900"
        : "text-slate-200 hover:bg-slate-800"
    }`;

  return (
    <aside className="sidebar-desktop hidden md:flex w-64 bg-slate-900 text-white p-4 flex-col">
      <h1 className="text-2xl font-bold mb-8">AIJOBMatching System</h1>
      <nav>
        <button
          type="button"
          className={itemClass("jobs")}
          onClick={() => onChangePage("jobs")}
        >
          案件一覧表示
        </button>
        <button
          type="button"
          className={itemClass("members")}
          onClick={() => onChangePage("members")}
        >
          要員一覧表示
        </button>
        <button
          type="button"
          className={itemClass("stats")}
          onClick={() => onChangePage("stats")}
        >
          統計情報
        </button>
      </nav>
    </aside>
  );
}