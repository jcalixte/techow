import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { ChecklistItem } from '@/models/ChecklistItem'

export interface State {
  cards: Array<{
    entity: Card
    complexity: number | null
  }>
  hows: Checklist[]
  howItems: ChecklistItem[]
}

export const state: State = {
  cards: [],
  hows: [],
  howItems: []
}
