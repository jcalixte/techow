export interface ChecklistItem {
  idChecklist: string
  state: string
  idMember: string | null
  id: string
  name: string
  nameData: string | null
  pos: number
  due: string | null
}
