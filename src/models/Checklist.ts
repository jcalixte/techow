import { ChecklistItem } from './ChecklistItem'

export interface Checklist {
  checkItems: ChecklistItem[]
  id: string
  idBoard: string
  idCard: string
  limits: {}
  name: string
  pos: number
}
