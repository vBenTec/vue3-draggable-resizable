import { Position, DraggableOptions, SizeLimits } from './types'


export const calculateSizeLimits = (
    options: DraggableOptions,
    parentWidth: number | null,
    parentHeight: number | null,
    currentWidth: number,
    currentHeight: number
): SizeLimits =>{
    const useParent = options.parent ?? false

    return {
        minWidth: options.minW ?? 0,
        minHeight: options.minH ?? 0,
        maxWidth: useParent && parentWidth !== null
            ? Math.min(parentWidth, options.maxW ?? Infinity)
            : options.maxW ?? Infinity,
        maxHeight: useParent && parentHeight !== null
            ? Math.min(parentHeight, options.maxH ?? Infinity)
            : options.maxH ?? Infinity,
        minLeft: useParent ? 0 : -Infinity,
        minTop: useParent ? 0 : -Infinity,
        maxLeft: useParent && parentWidth !== null ? parentWidth - currentWidth : Infinity,
        maxTop: useParent && parentHeight !== null ? parentHeight - currentHeight : Infinity
    }
}

export const constrainPosition = (
    x: number,
    y: number,
    width: number,
    height: number,
    limits: SizeLimits,
    options: DraggableOptions
): Position =>{
    let constrainedX = x
    let constrainedY = y
    let constrainedWidth = width
    let constrainedHeight = height

    // Constrain width
    if (!options.disabledW) {
        constrainedWidth = Math.min(
            limits.maxWidth,
            Math.max(limits.minWidth, width)
        )
    }

    // Constrain height
    if (!options.disabledH) {
        constrainedHeight = Math.min(
            limits.maxHeight,
            Math.max(limits.minHeight, height)
        )
    }

    // Constrain position
    if (!options.disabledX) {
        constrainedX = Math.min(
            limits.maxLeft,
            Math.max(limits.minLeft, x)
        )
    }

    if (!options.disabledY) {
        constrainedY = Math.min(
            limits.maxTop,
            Math.max(limits.minTop, y)
        )
    }

    return {
        x: constrainedX,
        y: constrainedY,
        w: constrainedWidth,
        h: constrainedHeight
    }
}

export const calculateResizeDelta =(
    handle: string,
    deltaX: number,
    deltaY: number,
    aspectRatio: number,
    lockAspectRatio: boolean
): { deltaX: number, deltaY: number } =>{
    if (!lockAspectRatio) {
        return { deltaX, deltaY }
    }

    // Save original signs
    const originalDeltaX = deltaX;
    const originalDeltaY = deltaY;

    // Make deltaX positive for calculation
    deltaX = Math.abs(deltaX);
    deltaY = deltaX * aspectRatio;

    // Determine orientation from handle
    const verticalOrientation = handle[0]; // 't', 'm', 'b'
    const horizontalOrientation = handle[1]; // 'l', 'm', 'r'

    // Apply direction based on original drag direction
    // If dragging left or (middle horizontal and up), make both deltas negative
    if (originalDeltaX < 0 || (horizontalOrientation === 'm' && originalDeltaY < 0)) {
        deltaX = -deltaX;
        deltaY = -deltaY;
    }

    return { deltaX, deltaY }
}