import { useMemo, useState } from 'react'
import { Plus, Search, Pin, Sparkles, X as XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import IngredientVessel from '../components/IngredientVessel'
import EmptyState from '../components/EmptyState'
import FridgeFrame from '../components/FridgeFrame'
import TemperatureTabs from '../components/TemperatureTabs'
import ShelfSection from '../components/ShelfSection'
import FridgeInterior from '../components/FridgeInterior'
import ShelfDivider from '../components/ShelfDivider'
import DoorPocketRow from '../components/DoorPocketRow'
import VeggieDrawer from '../components/VeggieDrawer'
import { isDoorItem } from '../data/doorGuide'
import { getVesselConfig } from '../data/vesselShapes'
import AddIngredientModal from './AddIngredientModal'

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'room', label: '실온' },
  { key: 'fridge', label: '냉장' },
  { key: 'frozen', label: '냉동' },
]

// 재료 용기들이 공유하는 flex 로우 레이아웃(v2에서 계승, 변경 없음)
const VESSEL_ROW_CLASS =
  'flex min-h-[78px] flex-wrap items-end gap-x-3.5 gap-y-5 md:min-h-[86px] md:gap-x-4 md:gap-y-6'

// AI 레시피 추천(/recipes/ai)은 정식 오픈 전까지 진입 버튼만 숨긴다.
// 재료 선택 모드 로직과 결과 페이지, 서버리스 함수는 그대로 두고 이 값만 true로 바꾸면 재노출된다.
const AI_RECIPE_ENABLED = false

export default function Fridge() {
  const navigate = useNavigate()
  const { ingredients, addIngredient, updateIngredient, removeIngredient } = useApp()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [modalState, setModalState] = useState(null) // null | 'new' | ingredient object
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())

  const filtered = useMemo(() => {
    return ingredients.filter((item) => {
      const matchesTab = tab === 'all' || item.category === tab
      const matchesQuery = item.name.includes(query.trim())
      return matchesTab && matchesQuery
    })
  }, [ingredients, tab, query])

  // v3.1(docs/03_냉장고_디자인_스펙.md 끝 절 참고): 카테고리별 별도 카드 대신 하나로 이어진
  // 인테리어 패널 안에 로우 그룹을 순서대로 배치한다. fridge 그룹은 도어 포켓(소스류)/유리 선반으로,
  // room 그룹은 채소 서랍(뿌리채소)/선반으로 한 번 더 나뉜다 — 둘 다 category 필드는 건드리지 않고
  // 이름 키워드 기반 파생 로직(isDoorItem, getVesselConfig의 tuber 판별)으로만 나눈다.
  const fridgeItems = useMemo(() => filtered.filter((item) => item.category === 'fridge'), [filtered])
  const fridgeShelfItems = useMemo(() => fridgeItems.filter((item) => !isDoorItem(item.name)), [fridgeItems])
  const fridgeDoorItems = useMemo(() => fridgeItems.filter((item) => isDoorItem(item.name)), [fridgeItems])

  const frozenItems = useMemo(() => filtered.filter((item) => item.category === 'frozen'), [filtered])

  const roomItems = useMemo(() => filtered.filter((item) => item.category === 'room'), [filtered])
  const roomShelfItems = useMemo(
    () => roomItems.filter((item) => getVesselConfig(item.name, 'room').shape !== 'tuber'),
    [roomItems]
  )
  const roomTuberItems = useMemo(
    () => roomItems.filter((item) => getVesselConfig(item.name, 'room').shape === 'tuber'),
    [roomItems]
  )

  const isEmpty = filtered.length === 0

  const toggleSelected = (item) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(item.id)) next.delete(item.id)
      else next.add(item.id)
      return next
    })
  }

  const openModal = (item) => {
    if (selectMode) {
      toggleSelected(item)
      return
    }
    setModalState(item)
  }

  const startSelectMode = () => {
    setSelectedIds(new Set())
    setSelectMode(true)
  }

  const cancelSelectMode = () => {
    setSelectMode(false)
    setSelectedIds(new Set())
  }

  const viewAiRecipes = () => {
    const ingredientNames = ingredients.filter((i) => selectedIds.has(i.id)).map((i) => i.name)
    if (ingredientNames.length === 0) return
    navigate('/recipes/ai', { state: { ingredientNames } })
    cancelSelectMode()
  }

  const blocks = []
  if (fridgeShelfItems.length > 0) {
    blocks.push(
      <ShelfSection key="fridge-shelf" category="fridge" label={`냉장 선반 · ${fridgeShelfItems.length}개`}>
        <div className={VESSEL_ROW_CLASS}>
          {fridgeShelfItems.map((item) => (
            <IngredientVessel
              key={item.id}
              ingredient={item}
              onClick={() => openModal(item)}
              selectable={selectMode}
              selected={selectedIds.has(item.id)}
            />
          ))}
        </div>
      </ShelfSection>
    )
  }
  if (fridgeDoorItems.length > 0) {
    blocks.push(
      <DoorPocketRow
        key="fridge-door"
        items={fridgeDoorItems}
        onItemClick={openModal}
        selectMode={selectMode}
        selectedIds={selectedIds}
      />
    )
  }
  if (frozenItems.length > 0) {
    blocks.push(
      <ShelfSection key="frozen" category="frozen" label={`냉동 선반 · ${frozenItems.length}개`}>
        <div className={VESSEL_ROW_CLASS}>
          {frozenItems.map((item) => (
            <IngredientVessel
              key={item.id}
              ingredient={item}
              onClick={() => openModal(item)}
              selectable={selectMode}
              selected={selectedIds.has(item.id)}
            />
          ))}
        </div>
      </ShelfSection>
    )
  }
  if (roomShelfItems.length > 0) {
    // 라벨 개수는 선반+서랍을 합친 room 총 개수(roomItems.length)를 표시한다 — "실온 선반 · N개"가
    // 실온 탭 전체 재료 수를 뜻하던 기존 동작(e2e/fridge.spec.js)을 그대로 유지하기 위함이다.
    blocks.push(
      <ShelfSection key="room-shelf" category="room" label={`실온 선반 · ${roomItems.length}개`}>
        <div className={VESSEL_ROW_CLASS}>
          {roomShelfItems.map((item) => (
            <IngredientVessel
              key={item.id}
              ingredient={item}
              onClick={() => openModal(item)}
              selectable={selectMode}
              selected={selectedIds.has(item.id)}
            />
          ))}
        </div>
      </ShelfSection>
    )
  }
  if (roomTuberItems.length > 0) {
    blocks.push(
      <VeggieDrawer
        key="veggie-drawer"
        items={roomTuberItems}
        onItemClick={openModal}
        selectMode={selectMode}
        selectedIds={selectedIds}
      />
    )
  }

  const rows = []
  blocks.forEach((block, idx) => {
    if (idx > 0) rows.push(<ShelfDivider key={`divider-${idx}`} />)
    rows.push(block)
  })

  return (
    <div className="px-4 pb-6 pt-6 md:px-8">
      <FridgeFrame>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">잇벤토리</p>
              <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {selectMode ? `재료 선택 · ${selectedIds.size}개` : '냉장고'}
              </h1>
            </div>
            {selectMode ? (
              <button
                onClick={cancelSelectMode}
                aria-label="재료 선택 취소"
                data-testid="cancel-select-mode"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XIcon size={18} />
              </button>
            ) : (
              <Search size={18} className="text-gray-400" aria-hidden="true" />
            )}
          </div>

          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="재료 이름으로 검색"
              className="w-full rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-sm focus:border-curry-400 focus:outline-none dark:border-gray-700 dark:bg-black/20 dark:text-gray-100"
            />
          </div>

          <div className="mt-3">
            <TemperatureTabs tabs={TABS} value={tab} onChange={setTab} />
          </div>

          {isEmpty ? (
            <div className="mt-6">
              <EmptyState
                title="아직 등록된 재료가 없어요"
                description="+ 버튼을 눌러 재료를 추가해보세요."
                actionLabel="재료 추가하기"
                onAction={() => setModalState('new')}
              />
            </div>
          ) : (
            <div className="mt-5">
              <FridgeInterior>
                <div className="space-y-4">{rows}</div>
              </FridgeInterior>
            </div>
          )}

          {ingredients.length > 0 && !selectMode && (
            <>
              <button
                onClick={() => navigate('/recipes')}
                className="relative mt-6 w-full rounded-2xl bg-white py-3 text-sm font-medium text-curry-600 shadow-sm ring-1 ring-curry-100 dark:bg-gray-800 dark:ring-curry-900/40"
              >
                <Pin
                  size={14}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-12 text-curry-600"
                  aria-hidden="true"
                />
                이 재료로 레시피 추천받기
              </button>

              {AI_RECIPE_ENABLED && (
                <button
                  onClick={startSelectMode}
                  data-testid="start-select-mode"
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-curry-600 py-3 text-sm font-medium text-white shadow-sm dark:bg-curry-500"
                >
                  <Sparkles size={16} />
                  레시피 확인하기
                </button>
              )}
            </>
          )}

          {selectMode && (
            <button
              onClick={viewAiRecipes}
              disabled={selectedIds.size === 0}
              data-testid="view-ai-recipes"
              className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-curry-600 py-3 text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 dark:bg-curry-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-500"
            >
              <Sparkles size={16} />
              {selectedIds.size > 0 ? `레시피보기 (${selectedIds.size})` : '재료를 선택해주세요'}
            </button>
          )}

          {!selectMode && (
            <button
              onClick={() => setModalState('new')}
              aria-label="재료 추가"
              className="absolute bottom-20 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-curry-600 text-white shadow-md ring-2 ring-white/40 transition hover:bg-curry-700 active:scale-95 dark:ring-black/20 md:bottom-6 md:right-6"
            >
              <Plus size={22} />
            </button>
          )}
      </FridgeFrame>

      {modalState && (
        <AddIngredientModal
          ingredient={modalState === 'new' ? null : modalState}
          onClose={() => setModalState(null)}
          onSave={(data) => {
            if (modalState === 'new') addIngredient(data)
            else updateIngredient(modalState.id, data)
            setModalState(null)
          }}
          onDelete={
            modalState !== 'new'
              ? () => {
                  removeIngredient(modalState.id)
                  setModalState(null)
                }
              : undefined
          }
        />
      )}
    </div>
  )
}
