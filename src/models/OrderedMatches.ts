export interface OrderedMatches<T> {
  [key: string]: {
    entity: T
    score: number
  }
}
