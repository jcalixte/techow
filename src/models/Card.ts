export interface Card {
  id: string
  checkItemStates: string | null
  closed: boolean
  dateLastActivity: string
  desc: string
  descData: { emoji: {} }
  dueReminder: string | null
  idBoard: string
  idList: string
  idMembersVoted: string[]
  idShort: number
  idAttachmentCover: string
  idLabels: string[]
  manualCoverAttachment: boolean
  name: string
  pos: number
  shortLink: string
  isTemplate: boolean
  badges: {
    attachmentsByType: { trello: { board: number; card: number } }
    location: boolean
    votes: number
    viewingMemberVoted: boolean
    subscribed: boolean
    fogbugz: string
    checkItems: number
    checkItemsChecked: number
    checkItemsEarliestDue: null
    comments: number
    attachments: number
    description: boolean
    due: null
    dueComplete: boolean
  }
  dueComplete: boolean
  due: null
  idChecklists: string[]
  idMembers: []
  labels: Array<{
    id: string
    idBoard: string
    name: string
    color: string
  }>
  shortUrl: string
  subscribed: boolean
  url: string
  cover: {
    idAttachment: string
    color: string | null
    idUploadedBackground: string | null
    size: string
    brightness: string
  }
}
