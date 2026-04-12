export function ReportsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-rubik font-bold text-neutral-800">
          דוחות
        </h2>
        <p className="text-sm font-rubik text-neutral-500 mt-1">
          דוחות מסירה ובדק בית
        </p>
      </header>

      <div className="bg-white rounded-lg border border-cream-200 p-12 text-center">
        <p className="text-3xl mb-3">📋</p>
        <h3 className="text-lg font-rubik font-semibold text-neutral-700 mb-2">
          בקרוב
        </h3>
        <p className="text-sm font-rubik text-neutral-400">
          עמוד זה נמצא בפיתוח ויופיע בגרסה הבאה.
        </p>
      </div>
    </div>
  );
}
