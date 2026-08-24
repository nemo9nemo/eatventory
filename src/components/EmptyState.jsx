export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 px-6 py-12 text-center dark:bg-gray-900">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{title}</p>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
