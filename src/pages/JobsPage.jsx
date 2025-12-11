import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";

const PAGE_SIZE = 50; // 1ページあたり件数

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // モーダル用 state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isMailOpen, setIsMailOpen] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setJobsLoading(true);
        setJobsError(null);

        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbz2_SYNhkbrBjp1Zv7zB2tQKesGNNtjQGgFBLsl7DmLd3PohCFBG0ZT9ojNReBXa2Zv/exec?type=anken_format"
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
        setJobsError(err.message);
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

  // モーダル制御用ハンドラ
  const handleOpenMail = (job) => {
    setSelectedJob(job);
    setIsMailOpen(true);
  };

  const handleCloseMail = () => {
    setIsMailOpen(false);
    setSelectedJob(null);
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
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
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
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
      {/* 共通のモーダルをここに 1 個だけ描画 */}
      {isMailOpen && selectedJob && (
        <MailModal job={selectedJob} onClose={handleCloseMail} />
      )}
    </div>
  );

  function MailModal({ job, onClose }) {
    const title = job["案件名"] || job["件名"];
    const mailBody = job["メール本文"];

    return (
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-lg max-w-3xl w-[90%] max-h-[80vh] p-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">{title} のメール本文</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-800 text-xl leading-none"
            >
              ×
            </button>
          </div>

          <pre className="whitespace-pre-wrap text-sm text-slate-800">
            {mailBody}
          </pre>
        </div>
      </div>
    );
  }
}
