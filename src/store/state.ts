import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { ChecklistItem } from '@/models/ChecklistItem'
import { CardScore } from '@/models/CardScore'

export interface CardComplexity {
  entity: Card
  complexity: number | null
}

export interface State {
  cards: CardComplexity[]
  checklists: Checklist[]
  hows: Checklist[]
  howItems: ChecklistItem[]
  newHowItems: string[]
  similarCards: CardScore[]
}

export const state: State = {
  cards: [],
  checklists: [],
  hows: [],
  howItems: [],
  newHowItems: [],
  similarCards: []
}
