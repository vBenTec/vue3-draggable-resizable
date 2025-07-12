import {inject, InjectionKey, provide} from "vue";

const identity = Symbol('identity') as InjectionKey<string | null>

export const useIdentity = () => inject(identity, null)

export const provideIdentity = (identity) => {
  provide(identity, identity)
}
