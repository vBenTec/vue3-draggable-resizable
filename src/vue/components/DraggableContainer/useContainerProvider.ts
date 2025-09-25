import {inject, InjectionKey, provide, reactive, Ref} from "vue";
import {GetPositionStore, MatchedLine, Position, PositionStore, SetMatchedLine, UpdatePosition} from "./types";
import {ContainerProvider} from "@/vue/components/DraggableResizable/types";

const CONTAINER_PROVIDER = Symbol('container-provider') as InjectionKey<ContainerProvider>

export const provideContainer = (props: Pick<ContainerProvider, 'disabled' | 'adsorbParent' | 'adsorbCols' | 'adsorbRows'> & {
    referenceLineVisible: Ref<boolean>
    referenceLineColor: Ref<string>
}  ) => {
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
        adsorbParent: props.adsorbParent,
        adsorbCols: props.adsorbCols,
        adsorbRows: props.adsorbRows,
    })

    return {state}
}

export const useContainerProvider = () => inject(CONTAINER_PROVIDER, null
)