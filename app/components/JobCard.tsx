// app/components/JobCard.tsx

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

interface JobCardProps {
  job: Job;
  onOpenMail: () => void;
}

export default function JobCard({ job, onOpenMail }: JobCardProps) {
  const title = job["案件名"] || job["件名"];
  const location = job["作業場所"];
  const workStyle = job["勤務形態"];
  const unitPrice = job["単価"];
  const startDate = job["稼働日付"];

  const skills = (job["必須スキル"] || "")
    .split(/、|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col gap-3 h-full">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>

        <p className="text-sm text-slate-600 mt-1">
          {location} ／ <span className="text-sm text-slate-600 mt-1">勤務形態: {workStyle}</span>
        </p>

        <p className="text-sm text-slate-600 mt-1">単価: {unitPrice}</p>
        <p className="text-xs text-slate-500 mt-1">稼働開始: {startDate}</p>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-block text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2">
        <button
          type="button"
          onClick={onOpenMail}
          className="text-xs px-3 py-1 rounded bg-slate-800 text-white hover:bg-slate-700"
        >
          メール本文を見る
        </button>
      </div>
    </div>
  );
}