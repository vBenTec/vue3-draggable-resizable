import {addEvent, filterHandles, removeEvent} from "@/components/utils";
import {ResizingHandle} from "@/components/types";
import {computed, onUnmounted} from "vue";
import {initLimitSizeAndMethods, initParent, initState} from "@/components/hooks";

type HandleEvent = MouseEvent | TouchEvent


const DOWN_HANDLES: (keyof HTMLElementEventMap)[] = ['mousedown', 'touchstart']
const UP_HANDLES: (keyof HTMLElementEventMap)[] = ['mouseup', 'touchend']
const MOVE_HANDLES: (keyof HTMLElementEventMap)[] = ['mousemove', 'touchmove']

function getPosition(e: HandleEvent) {
    if ('touches' in e) {
        return [e.touches[0].pageX, e.touches[0].pageY]
    } else {
        return [e.pageX, e.pageY]
    }
}

export const useResizeHandle = (
    containerProps: ReturnType<typeof initState>,
    limitProps: ReturnType<typeof initLimitSizeAndMethods>,
    parentSize: ReturnType<typeof initParent>,
    props: any,
    emit: any
) => {
    const { setWidth, setHeight, setLeft, setTop } = limitProps
    const { width, height, left, top, aspectRatio } = containerProps
    const {
        setResizing,
        setResizingHandle,
        setResizingMaxWidth,
        setResizingMaxHeight,
        setResizingMinWidth,
        setResizingMinHeight
    } = containerProps
    const { parentWidth, parentHeight } = parentSize

    let lstW = 0
    let lstH = 0
    let lstX = 0
    let lstY = 0
    let lstPageX = 0
    let lstPageY = 0
    let tmpAspectRatio = 1
    let verticalOrientation = ''
    let horizontalOrientation = ''

    const documentElement = document.documentElement
    
    const resizeHandleDrag = (e: HandleEvent) => {
        e.preventDefault()
        let [_pageX, _pageY] = getPosition(e)
        let deltaX = _pageX - lstPageX
        let deltaY = _pageY - lstPageY
        let _deltaX = deltaX
        let _deltaY = deltaY
        if (props.lockAspectRatio) {
            deltaX = Math.abs(deltaX)
            deltaY = deltaX * tmpAspectRatio
            if (verticalOrientation === 't') {
                if (_deltaX < 0 || (horizontalOrientation === 'm' && _deltaY < 0)) {
                    deltaX = -deltaX
                    deltaY = -deltaY
                }
            } else {
                if (_deltaX < 0 || (horizontalOrientation === 'm' && _deltaY < 0)) {
                    deltaX = -deltaX
                    deltaY = -deltaY
                }
            }
        }
        if (verticalOrientation === 't') {
            setHeight(lstH - deltaY)
            setTop(lstY - (height.value - lstH))
        } else if (verticalOrientation === 'b') {
            setHeight(lstH + deltaY)
        }
        if (horizontalOrientation === 'l') {
            setWidth(lstW - deltaX)
            setLeft(lstX - (width.value - lstW))
        } else if (horizontalOrientation === 'r') {
            setWidth(lstW + deltaX)
        }
        emit('resizing', {
            x: left.value,
            y: top.value,
            w: width.value,
            h: height.value
        })
    }
    const resizeHandleUp = () => {
        emit('resize-end', {
            x: left.value,
            y: top.value,
            w: width.value,
            h: height.value
        })
        setResizingHandle('')
        setResizing(false)
        setResizingMaxWidth(Infinity)
        setResizingMaxHeight(Infinity)
        setResizingMinWidth(props.minW)
        setResizingMinHeight(props.minH)
        // document.documentElement.removeEventListener('mousemove', resizeHandleDrag)
        // document.documentElement.removeEventListener('mouseup', resizeHandleUp)
        removeEvent(documentElement, MOVE_HANDLES, resizeHandleDrag)
        removeEvent(documentElement, UP_HANDLES, resizeHandleUp)
    }
    const resizeHandleDown = (e: HandleEvent, handleType: ResizingHandle) => {
        if (!props.resizable) return
        e.stopPropagation()

        console.log(e)
        console.log(handleType)

        setResizingHandle(handleType)
        setResizing(true)

        verticalOrientation = handleType[0]
        horizontalOrientation = handleType[1]

        if (aspectRatio.value) {
            if (['tl', 'tm', 'ml', 'bl'].includes(handleType)) {
                verticalOrientation = 't'
                horizontalOrientation = 'l'
            } else {
                verticalOrientation = 'b'
                horizontalOrientation = 'r'
            }
        }
        let minHeight = props.minH as number
        let minWidth = props.minW as number
        if (minHeight / minWidth > aspectRatio.value) {
            minWidth = minHeight / aspectRatio.value
        } else {
            minHeight = minWidth * aspectRatio.value
        }
        setResizingMinWidth(minWidth)
        setResizingMinHeight(minHeight)
        if (parent) {
            let maxHeight =
                verticalOrientation === 't' ? top.value + height.value : parentHeight.value - top.value
            let maxWidth =
                horizontalOrientation === 'l' ? left.value + width.value : parentWidth.value - left.value
            if (props.lockAspectRatio) {
                if (maxHeight / maxWidth < aspectRatio.value) {
                    maxWidth = maxHeight / aspectRatio.value
                } else {
                    maxHeight = maxWidth * aspectRatio.value
                }
            }
            setResizingMaxHeight(maxHeight)
            setResizingMaxWidth(maxWidth)
        }
        lstW = width.value
        lstH = height.value
        lstX = left.value
        lstY = top.value
        const lstPagePosition = getPosition(e)
        lstPageX = lstPagePosition[0]
        lstPageY = lstPagePosition[1]
        tmpAspectRatio = aspectRatio.value
        emit('resize-start', {
            x: left.value,
            y: top.value,
            w: width.value,
            h: height.value
        })
        // document.documentElement.addEventListener('mousemove', resizeHandleDrag)
        // document.documentElement.addEventListener('mouseup', resizeHandleUp)
        addEvent(documentElement, MOVE_HANDLES, resizeHandleDrag)
        addEvent(documentElement, UP_HANDLES, resizeHandleUp)
    }
    onUnmounted(() => {
        // document.documentElement.removeEventListener('mouseup', resizeHandleDrag)
        // document.documentElement.removeEventListener('mousemove', resizeHandleUp)
        removeEvent(documentElement, UP_HANDLES, resizeHandleUp)
        removeEvent(documentElement, MOVE_HANDLES, resizeHandleDrag)
    })
    const handlesFiltered = computed(() =>
        props.resizable ? filterHandles(props.handles) : []
    )
    return {
        handlesFiltered,
        resizeHandleDown
    }
}