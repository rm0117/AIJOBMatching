'use client';

export default function MailModal({
  title,
  body,
  onClose,
}: {
  title: string;
  body: string;
  onClose: () => void;
}) {
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
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xl leading-none"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        <pre className="whitespace-pre-wrap text-sm text-slate-800">
          {body}
        </pre>
      </div>
    </div>
  );
}
