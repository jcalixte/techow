export interface Board {
  closed: boolean
  creationMethod: string | null
  dateLastActivity: string
  dateLastView: string
  datePluginDisable: string | null
  desc: ''
  descData: string | null
  enterpriseOwned: boolean
  id: string
  idBoardSource: string | null
  idEnterprise: string | null
  idOrganization: string
  idTags: string[]
  ixUpdate: string | null
  labelNames: {
    [key: string]: string
  }
  limits: null
  memberships: Array<{
    deactivated: boolean
    id: string
    idMember: string
    memberType: string
    unconfirmed: boolean
  }>
  name: string
  pinned: null
  powerUps: string[]
  prefs: {
    background: string
    backgroundBottomColor: string
    backgroundBrightness: string
    backgroundImage: string
    backgroundImageScaled: Array<{
      height: number
      url: string
      width: number
    }>
    backgroundTile: boolean
    backgroundTopColor: string
    calendarFeedEnabled: boolean
    canBeEnterprise: boolean
    canBeOrg: boolean
    canBePrivate: boolean
    canBePublic: boolean
    canInvite: true
    cardAging: 'regular'
    cardCovers: true
    comments: 'members'
    hideVotes: boolean
    invitations: 'members'
    isTemplate: boolean
    permissionLevel: 'org'
    selfJoin: true
    voting: string
  }
  shortLink: string
  shortUrl: string
  starred: boolean
  subscribed: boolean
  templateGallery: string | null
  url: string
}
