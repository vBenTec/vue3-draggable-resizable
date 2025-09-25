import { ReferenceLineMap, PositionStore, ContainerOptions } from './types'

export const getReferenceLineMap = (
    containerOptions: ContainerOptions,
    parentWidth: number,
    parentHeight: number,
    positionStore: PositionStore,
    excludeId?: string
): ReferenceLineMap | null => {
    if (containerOptions.disabled) return null

    const referenceLine = {
        row: [] as number[],
        col: [] as number[]
    }

    referenceLine.row.push(...(containerOptions.adsorbRows || []))
    referenceLine.col.push(...(containerOptions.adsorbCols || []))

    if (containerOptions.adsorbParent) {
        referenceLine.row.push(0, parentHeight, parentHeight / 2)
        referenceLine.col.push(0, parentWidth, parentWidth / 2)
    }

    const filteredStore = { ...positionStore }
    if (excludeId) {
        delete filteredStore[excludeId]
    }

    Object.values(filteredStore).forEach(({x, y, w, h}) => {
        referenceLine.row.push(y, y + h, y + h / 2)
        referenceLine.col.push(x, x + w, x + w / 2)
    })

    return {
        row: referenceLine.row.reduce((pre, cur) => {
            return {...pre, [cur]: {min: cur - 5, max: cur + 5, value: cur}}
        }, {}),
        col: referenceLine.col.reduce((pre, cur) => {
            return {...pre, [cur]: {min: cur - 5, max: cur + 5, value: cur}}
        }, {})
    } as ReferenceLineMap
}

export const findMatchedLine = (
    referenceLineMap: ReferenceLineMap,
    widgetLines: { col: number[], row: number[] },
    widgetSize: { width: number, height: number }
): { row: number[], col: number[], snappedX?: number, snappedY?: number } => {
    const matched: { row: number[], col: number[], snappedX?: number, snappedY?: number } = {
        row: [],
        col: []
    }

    // Check row matches
    for (let i = 0; i < widgetLines.row.length; i++) {
        const line = widgetLines.row[i]
        for (const refLine of Object.values(referenceLineMap.row)) {
            if (line >= refLine.min && line <= refLine.max) {
                matched.row.push(refLine.value)
                // Calculate snapped position based on which line matched
                if (i === 0) {
                    matched.snappedY = refLine.value
                } else if (i === 1) {
                    matched.snappedY = refLine.value - widgetSize.height / 2
                } else if (i === 2) {
                    matched.snappedY = refLine.value - widgetSize.height
                }
                break
            }
        }
    }

    // Check col matches
    for (let i = 0; i < widgetLines.col.length; i++) {
        const line = widgetLines.col[i]
        for (const refLine of Object.values(referenceLineMap.col)) {
            if (line >= refLine.min && line <= refLine.max) {
                matched.col.push(refLine.value)
                // Calculate snapped position based on which line matched
                if (i === 0) {
                    matched.snappedX = refLine.value
                } else if (i === 1) {
                    matched.snappedX = refLine.value - widgetSize.width / 2
                } else if (i === 2) {
                    matched.snappedX = refLine.value - widgetSize.width
                }
                break
            }
        }
    }

    return matched
}