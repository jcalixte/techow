export interface Label {
  [label: string]: number
}

export interface Perf {
  _id: string
  date: Date
  labels: Label
}
