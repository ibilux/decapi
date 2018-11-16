import {
  interfaceTypeRegistry,
  interfaceClassesSet,
  interfaceTypeImplementors
} from './interfaceTypeRegistry'

import { GraphQLInterfaceType, GraphQLResolveInfo } from 'graphql'

import { compileAllFields } from '../field/Field'
import { createCachedThunk } from '../../services/utils/cachedThunk'
import { getClassWithAllParentClasses } from '../../services/utils/inheritance'
import { objectTypeRegistry } from '../objectType/registry'

export interface InterfaceTypeResolver {
  (value: any, context: any, info: GraphQLResolveInfo): any
}

export interface InterfaceTypeOptions {
  name?: string
  description?: string
}

const compileInterfaceCache = new WeakMap<Function, GraphQLInterfaceType>()

export function InterfaceType(config?: InterfaceTypeOptions): ClassDecorator {
  return (target) => {
    interfaceClassesSet.add(target)

    const typeGetter = () => {
      if (compileInterfaceCache.has(target)) {
        return compileInterfaceCache.get(target)
      }

      const name = config && config.name ? config.name : target.name

      const description = config ? config.description : null
      const intfc = new GraphQLInterfaceType({
        name,
        description,
        resolveType: (value: any) => {
          const implementors = interfaceTypeImplementors.get(target)
          for (let implementor of implementors) {
            if (Object.getPrototypeOf(value) === implementor.prototype) {
              const typeGetter = objectTypeRegistry.get(implementor)
              return typeGetter()
            }
          }
        },
        fields: createCachedThunk(() => {
          const targetWithParents = getClassWithAllParentClasses(target)

          return compileAllFields(targetWithParents)
        })
      })
      compileInterfaceCache.set(target, intfc)

      return intfc
    }

    interfaceTypeRegistry.set(target, typeGetter)
  }
}
