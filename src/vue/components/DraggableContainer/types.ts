export interface Position {
    x: number
    y: number
    w: number
    h: number
}

export interface PositionStore {
    [propName: string]: Position
}

export type GetPositionStore = (excludeId?: string) => PositionStore

export interface MatchedLine {
    row: number[]
    col: number[]
}

export type SetMatchedLine = (matchedLine: MatchedLine | null) => void

export type UpdatePosition = (id: string, position: Position) => void

export interface Props {
    disabled?: boolean;
    adsorbParent?: boolean
    adsorbCols?: number[]
    adsorbRows?: number[]
    referenceLineVisible?: boolean
    referenceLineColor?: string
}