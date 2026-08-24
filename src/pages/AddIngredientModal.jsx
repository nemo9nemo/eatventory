import { useState } from 'react'
import { X } from 'lucide-react'

const CATEGORY_OPTIONS = [
  { key: 'room', label: '실온' },
  { key: 'fridge', label: '냉장' },
  { key: 'frozen', label: '냉동' },
]

export default function AddIngredientModal({ ingredient, onClose, onSave, onDelete }) {
  const [name, setName] = useState(ingredient?.name ?? '')
  const [category, setCategory] = useState(ingredient?.category ?? 'fridge')
  const [expiresInDays, setExpiresInDays] = useState(
    typeof ingredient?.expiresInDays === 'number' ? String(ingredient.expiresInDays) : ''
  )
  const [error, setError] = useState('')

  function handleSave() {
    if (!name.trim()) {
      setError('재료 이름을 입력해주세요.')
      return
    }
    onSave({
      name: name.trim(),
      category,
      expiresInDays: expiresInDays === '' ? null : Number(expiresInDays),
    })
  }

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 md:items-center"
      onClick={onClose}
      data-testid="ingredient-modal"
    >
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900">{ingredient ? '재료 수정' : '재료 추가'}</h2>
          <button onClick={onClose} aria-label="닫기">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500">재료 이름</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder="예: 계란"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500">보관 구분</label>
          <div className="mt-1 flex gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setCategory(opt.key)}
                data-testid={`category-${opt.key}`}
                className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                  category === opt.key ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-gray-500">유통기한 (며칠 후, 선택)</label>
          <input
            type="number"
            min="0"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            placeholder="미입력 시 유통기한 표시 없음"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          data-testid="save-ingredient"
          className="mt-5 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          저장
        </button>

        {onDelete && (
          <button onClick={onDelete} data-testid="delete-ingredient" className="mt-2 w-full py-2 text-sm text-red-500">
            삭제
          </button>
        )}
      </div>
    </div>
  )
}
