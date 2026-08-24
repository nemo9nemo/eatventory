export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 px-6 py-12 text-center">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
