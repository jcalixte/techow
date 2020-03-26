import { Card } from '@/models/Card'
import { Checklist } from '@/models/Checklist'
import { ChecklistItem } from '@/models/ChecklistItem'
import { Board } from '@/models/Board'

export interface CardComplexity {
  entity: Card
  complexity: number | null
}

export interface State {
  board: Board | null
  cards: CardComplexity[]
  hows: Checklist[]
  howItems: ChecklistItem[]
  newHowItems: string[]
}

export const state: State = {
  board: null,
  cards: [],
  hows: [],
  howItems: [],
  newHowItems: []
}
