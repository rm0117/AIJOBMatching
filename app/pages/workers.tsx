'use client';

import { useEffect, useMemo, useState } from 'react';
import WorkerCard, { Worker } from '../components/WorkerCard';
import MailModal from '../components/MailModal';

const PAGE_SIZE = 50;

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [workersError, setWorkersError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 検索
  const [q, setQ] = useState('');

  // モーダル表示制御
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailTitle, setMailTitle] = useState('');
  const [mailBody, setMailBody] = useState('');

  /* ===== API取得 ===== */
  useEffect(() => {
    async function fetchWorkers() {
      try {
        setWorkersLoading(true);
        setWorkersError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/exec?type=yoin_format`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const workersArray = Array.isArray(data.records) ? data.records : [];
        setWorkers(workersArray);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setWorkersError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setWorkersLoading(false);
      }
    }

    fetchWorkers();
  }, []);

  /* ===== 検索 ===== */
  const filteredWorkers = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return workers;

    return workers.filter((w) => {
      const hay = [
        w.ID,
        w.受信日時,
        w.氏名,
        String(w.年齢 ?? ''),
        w.スキル,
        w.最寄駅,
        w['勤務形態（希望）'],
        w['単価（希望）'],
        w.備考,
        w.メールタイトル,
        w.メール本文,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return hay.includes(key);
    });
  }, [q, workers]);

  /* ===== ページング ===== */
  const totalPages =
    filteredWorkers.length > 0
      ? Math.ceil(filteredWorkers.length / PAGE_SIZE)
      : 1;

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const visibleWorkers = filteredWorkers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  /* ===== メールモーダル制御 ===== */
  const handleOpenMail = (worker: Worker) => {
    const title =
      worker.メールタイトル || worker.氏名 || worker.ID || 'メール';
    const body = worker.メール本文 || '—';

    setMailTitle(title);
    setMailBody(body);
    setIsMailOpen(true);
  };

  const handleCloseMail = () => {
    setIsMailOpen(false);
    setMailTitle('');
    setMailBody('');
  };

  /* ===== 画面 ===== */
  return (
    <div className="flex-1 p-6 space-y-4">
      {/* ヘッダ */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold">要員一覧</h2>

        <input
          className="w-full rounded-lg border px-3 py-2 text-sm md:w-80"
          placeholder="検索（氏名・スキル・駅・単価・メール等）"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ローディング */}
      {workersLoading && (
        <div className="text-center text-blue-600 py-6 animate-pulse">
          データ取得中です… 少々お待ちください
        </div>
      )}

      {/* エラー */}
      {workersError && !workersLoading && (
        <div className="text-center text-red-600 py-6">
          データの取得に失敗しました。
          <br />
          時間をおいて再度お試しください。
        </div>
      )}

      {/* 一覧 */}
      {!workersLoading && !workersError && (
        <>
          <div className="space-y-3">
            {visibleWorkers.length > 0 ? (
              visibleWorkers.map((w) => (
                <WorkerCard
                  key={w.ID}
                  worker={w}
                  onOpenMail={() => handleOpenMail(w)}
                />
              ))
            ) : (
              <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
                表示できる要員はありません
              </div>
            )}
          </div>

          {/* ページング */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className={`px-3 py-1 text-sm rounded border ${
                  safePage === 1
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                前へ
              </button>

              <span className="text-sm text-gray-600">
                {safePage} / {totalPages} ページ
              </span>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage === totalPages}
                className={`px-3 py-1 text-sm rounded border ${
                  safePage === totalPages
                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}

      {/* メールモーダル */}
      {isMailOpen && (
        <MailModal
          title={mailTitle}
          body={mailBody}
          onClose={handleCloseMail}
        />
      )}
    </div>
  );
}
