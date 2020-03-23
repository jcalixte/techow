import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { ChecklistItem } from '@/models/ChecklistItem'

export interface CardComplexity {
  entity: Card
  complexity: number | null
}

export interface State {
  cards: CardComplexity[]
  hows: Checklist[]
  howItems: ChecklistItem[]
}

export const state: State = {
  cards: [],
  hows: [],
  howItems: []
}
