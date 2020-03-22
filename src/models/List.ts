export interface List {
  id: string
  name: string
  closed: boolean
  idBoard: string
  pos: number
  subscribed: boolean
  softLimit: string | null
}
