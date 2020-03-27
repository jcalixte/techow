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
  hows: Checklist[]
  howItems: ChecklistItem[]
  newHowItems: string[]
  similarCards: CardScore[]
}

export const state: State = {
  cards: [],
  hows: [],
  howItems: [],
  newHowItems: [],
  similarCards: []
}
