'use client';

import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import MailModal from '../components/MailModal';

const PAGE_SIZE = 50; // 1ページあたり件数

interface Job {
  ID?: string;
  案件名?: string;
  件名?: string;
  作業場所?: string;
  勤務形態?: string;
  単価?: string;
  稼働日付?: string;
  必須スキル?: string;
  メール本文?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isMailOpen, setIsMailOpen] = useState(false);
  const [mailTitle, setMailTitle] = useState('');
  const [mailBody, setMailBody] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/exec?type=anken_format`
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        const jobsArray = Array.isArray(data.records) ? data.records : [];
        setJobs(jobsArray);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setJobsError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setJobsLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const totalPages =
    jobs && jobs.length > 0 ? Math.ceil(jobs.length / PAGE_SIZE) : 1;

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;

  const visibleJobs = Array.isArray(jobs)
    ? jobs.slice(startIndex, startIndex + PAGE_SIZE)
    : [];

  // モーダル制御
  const handleOpenMail = (job: Job) => {
    const title = job['案件名'] || job['件名'] || job.ID || 'メール';
    const body = job['メール本文'] || '—';

    setMailTitle(title);
    setMailBody(body);
    setIsMailOpen(true);
  };

  const handleCloseMail = () => {
    setIsMailOpen(false);
    setMailTitle('');
    setMailBody('');
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">案件一覧</h2>

      {/* ローディング */}
      {jobsLoading && (
        <div className="text-center text-blue-600 py-6 animate-pulse">
          データ取得中です… 少々お待ちください
        </div>
      )}

      {/* エラー */}
      {jobsError && !jobsLoading && (
        <div className="text-center text-red-600 py-6">
          データの取得に失敗しました。
          <br />
          時間をおいて再度お試しください。
        </div>
      )}

      {/* データ */}
      {!jobsLoading && !jobsError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleJobs.length > 0 ? (
              visibleJobs.map((job) => (
                <JobCard
                  key={job.ID || job.案件名}
                  job={job}
                  onOpenMail={() => handleOpenMail(job)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                表示できる案件はありません
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
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

      {/* ✅ 共通モーダルを1個だけ描画 */}
      {isMailOpen && (
        <MailModal title={mailTitle} body={mailBody} onClose={handleCloseMail} />
      )}
    </div>
  );
}
