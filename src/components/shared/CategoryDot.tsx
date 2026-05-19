import { getCategoryMeta } from '../../types'
import type { Category } from '../../types'

interface Props {
  category: Category
  size?: number
}

export function CategoryDot({ category, size = 10 }: Props) {
  const meta = getCategoryMeta(category)
  return (
    <span
      style={{ width: size, height: size, backgroundColor: meta.color }}
      className="inline-block rounded-full flex-shrink-0"
    />
  )
}
