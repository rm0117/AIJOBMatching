'use client';

import { useMemo } from 'react';

/* workers.tsx と同じ型をコピペ */
export type Worker = {
  ID?: string;
  受信日時?: string;
  氏名?: string;
  年齢?: string | number;
  スキル?: string;
  最寄駅?: string;
  "勤務形態（希望）"?: string;
  "単価（希望）"?: string;
  備考?: string;
  メールタイトル?: string;
  メール本文?: string;
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs bg-white">
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="truncate text-sm">{value || '—'}</div>
    </div>
  );
}

export default function WorkerCard({
  worker,
  onOpenMail,
}: {
  worker: Worker;
  onOpenMail: () => void;
}) {
  const skills = useMemo(() => {
    const raw = worker.スキル ?? '';
    const arr = raw
      .split(/[,、/|・\n]+|\s{2,}/)
      .map((s) => s.trim())
      .filter(Boolean);

    return Array.from(new Set(arr)).slice(0, 15);
  }, [worker.スキル]);

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      {/* 上段 */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="font-semibold text-lg">{worker.氏名 || '（氏名未設定）'}</div>

        {worker.ID && (
            <span className="text-xs text-gray-500">
            ID: <span className="font-mono text-gray-700">{worker.ID}</span>
            </span>
        )}

        {worker.年齢 !== undefined && worker.年齢 !== null && (
            <span className="text-xs text-gray-500">
            年齢: <span className="font-medium text-gray-700">{worker.年齢}歳</span>
            </span>
        )}
        </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((s, i) => <Badge key={`${s}-${i}`}>{s}</Badge>)
            ) : (
              <span className="text-xs text-gray-500">スキル情報なし</span>
            )}
          </div>
        </div>

        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 border border-slate-200">
        受信: {worker.受信日時}
        </span>
      </div>

      {/* 中段 */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Field label="最寄駅" value={worker.最寄駅} />
        <Field label="勤務形態（希望）" value={worker['勤務形態（希望）']} />
        <Field label="単価（希望）" value={worker['単価（希望）']} />
      </div>
      {worker.備考 && worker.備考.trim() !== "" && (
        <div className="mt-4 rounded-lg border bg-slate-50 p-3">
            <div className="text-xs text-gray-500 mb-1">備考</div>
            <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
            {worker.備考}
            </div>
        </div>
      )}

      {/* メールタイトル */}
      <div className="mt-4">
        <div className="text-xs text-gray-500">メール</div>
        <button
        type="button"
        onClick={onOpenMail}
        className="
            mt-1 w-full text-left rounded-lg px-3 py-2 text-sm
            bg-slate-700 text-white
            shadow-sm
            hover:bg-slate-800 hover:shadow-md
            active:translate-y-px active:shadow-sm
            transition
            focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
        "
        >
        <span
        className="block truncate"
        title={worker.メールタイトル || "（タイトルなし）"}
        >
        {worker.メールタイトル && worker.メールタイトル.trim() !== ""
            ? worker.メールタイトル
            : "（タイトルなし：クリックで本文表示）"}
        </span>
        </button>
      </div>
    </div>
  );
}
