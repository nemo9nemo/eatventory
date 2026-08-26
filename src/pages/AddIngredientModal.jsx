import { useEffect, useState } from 'react'
import { X, ScanBarcode } from 'lucide-react'
import { useBarcodeScanner } from '../hooks/useBarcodeScanner'
import { lookupProductByBarcode } from '../utils/barcodeLookup'
import { guessStorageCategory } from '../data/storageGuide'

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
  // 신규 등록일 때만 이름 기반 보관 구분 자동 추천을 켠다. 사용자가 보관 구분을
  // 직접 클릭하는 순간부터는 더 이상 이름 변경으로 값을 덮어쓰지 않는다.
  const [categoryTouched, setCategoryTouched] = useState(!!ingredient)

  // 'form' | 'scan' — scanning is only ever entered for a brand-new ingredient.
  const [mode, setMode] = useState('form')
  const [scanHint, setScanHint] = useState(null) // { type: 'success' | 'fail', text: string }
  const [isLookingUp, setIsLookingUp] = useState(false)

  const { videoRef, status: scanStatus, start: startScan, stop: stopScan } = useBarcodeScanner({
    onDetected: async (barcodeText) => {
      setIsLookingUp(true)
      const product = await lookupProductByBarcode(barcodeText)
      setIsLookingUp(false)
      if (product) {
        setName(product.name)
        setScanHint({ type: 'success', text: `바코드로 인식했어요: ${product.name}` })
      } else {
        setName('')
        setScanHint({ type: 'fail', text: '상품 정보를 찾을 수 없어요. 이름을 직접 입력해주세요.' })
      }
      setMode('form')
    },
  })

  useEffect(() => {
    if (mode === 'scan') {
      startScan()
    } else {
      stopScan()
    }
    // Only re-run when the mode actually changes; start/stop identities are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

  // 재료명으로 보관 구분 자동 추천 — 신규 등록이고, 사용자가 아직 보관 구분을
  // 직접 고르지 않았을 때만 적용한다(바코드 스캔으로 이름이 채워지는 경우도 포함).
  useEffect(() => {
    if (ingredient || categoryTouched) return
    const guess = guessStorageCategory(name)
    if (guess) setCategory(guess)
  }, [name, ingredient, categoryTouched])

  useEffect(() => {
    // Extra safety net: always release the camera when the modal itself unmounts.
    return () => stopScan()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function switchToManual() {
    setMode('form')
  }

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
      <div
        className="w-full max-w-sm rounded-t-2xl bg-white p-5 dark:bg-gray-900 md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">{ingredient ? '재료 수정' : '재료 추가'}</h2>
          <button onClick={onClose} aria-label="닫기">
            <X size={20} className="text-gray-400 dark:text-gray-500" />
          </button>
        </div>

        {mode === 'scan' ? (
          <div className="mt-4" data-testid="barcode-scanner">
            {isLookingUp ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-300">상품 정보를 확인하고 있어요...</p>
              </div>
            ) : scanStatus === 'denied' || scanStatus === 'error' ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-300">카메라를 사용할 수 없어요</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">권한을 확인하거나 이름을 직접 입력해주세요.</p>
                <button
                  onClick={switchToManual}
                  data-testid="manual-fallback"
                  className="mt-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  직접 입력하기
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg bg-black">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline />
                <p className="bg-black/60 p-2 text-center text-xs text-white">
                  {scanStatus === 'requesting' ? '카메라를 확인하고 있어요...' : '바코드를 카메라에 비춰주세요'}
                </p>
              </div>
            )}

            <button
              onClick={switchToManual}
              data-testid="switch-to-manual"
              className="mt-3 w-full text-center text-xs text-gray-400 underline dark:text-gray-500"
            >
              직접 입력으로 전환
            </button>
          </div>
        ) : (
          <>
            {!ingredient && (
              <button
                onClick={() => {
                  setScanHint(null)
                  setMode('scan')
                }}
                data-testid="scan-barcode"
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-emerald-300 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              >
                <ScanBarcode size={14} />
                바코드로 스캔
              </button>
            )}

            {scanHint && (
              <p
                className={`mt-2 text-xs ${
                  scanHint.type === 'success'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {scanHint.text}
              </p>
            )}

            <div className="mt-4">
              <label className="text-xs text-gray-500 dark:text-gray-400">재료 이름</label>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="예: 계란"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
              />
              {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-gray-500 dark:text-gray-400">보관 구분</label>
                {!ingredient && !categoryTouched && guessStorageCategory(name) && (
                  <span
                    data-testid="category-auto-hint"
                    className="text-[11px] text-emerald-600 dark:text-emerald-400"
                  >
                    재료명으로 자동 추천했어요
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-2">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setCategory(opt.key)
                      setCategoryTouched(true)
                    }}
                    data-testid={`category-${opt.key}`}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                      category === opt.key
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs text-gray-500 dark:text-gray-400">유통기한 (며칠 후, 선택)</label>
              <input
                type="number"
                min="0"
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(e.target.value)}
                placeholder="미입력 시 유통기한 표시 없음"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleSave}
              data-testid="save-ingredient"
              className="mt-5 w-full rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              저장
            </button>

            {onDelete && (
              <button
                onClick={onDelete}
                data-testid="delete-ingredient"
                className="mt-2 w-full py-2 text-sm text-red-500 dark:text-red-400"
              >
                삭제
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
