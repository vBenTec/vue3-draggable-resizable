import {inject, InjectionKey, provide, reactive, Ref} from "vue";
import {GetPositionStore, MatchedLine, Position, PositionStore, SetMatchedLine, UpdatePosition} from "@/legacy/types";
import {useDraggableContainer} from "@/composables/useDraggableContainer";

const CONTAINER_PROVIDER = Symbol('container-provider') as InjectionKey<{
    updatePosition: UpdatePosition
    getPositionStore: GetPositionStore
    setMatchedLine: SetMatchedLine
    disabled?: Ref<boolean>
    adsorbParent?: Ref<boolean>
    adsorbCols?: number[]
    adsorbRows?: number[]
}>

export const provideContainer = (props: {
    disabled?: Ref<boolean>
    absorbParent?: Ref<boolean>
    adsorbCols?: number[]
    adsorbRows?: number[]
}) => {
    const positionStore = reactive<PositionStore>({})

    const updatePosition: UpdatePosition = (id: string, position: Position) => {
        positionStore[id] = position
    }
    const getPositionStore: GetPositionStore = (excludeId?: string) => {
        const _positionStore = Object.assign({}, positionStore)
        if (excludeId) {
            delete _positionStore[excludeId]
        }
        return _positionStore
    }

    const state = reactive<{
        matchedLine: MatchedLine | null
    }>({
        matchedLine: null
    })


    const setMatchedLine: SetMatchedLine = (
        matchedLine: MatchedLine | null
    ) => {
        state.matchedLine = matchedLine
    }

    provide(CONTAINER_PROVIDER, {
        updatePosition,
        getPositionStore,
        setMatchedLine,
        disabled: props.disabled,
        adsorbParent: props.absorbParent,
        adsorbCols: props.adsorbCols,
        adsorbRows: props.adsorbRows,
    })

    return {state}
}

export const useContainerProvider = () => inject(CONTAINER_PROVIDER, null
)