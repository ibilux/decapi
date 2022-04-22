import { argRegistry } from './registry'
export { compileFieldArgs } from './compiler'
import { IArgOptions } from './options'

export function Arg(options: IArgOptions = {}): ParameterDecorator {
  return (target: Object, fieldName: string, argIndex: number) => {
    argRegistry.set(target.constructor, [fieldName, argIndex], {
      ...options,
      argIndex
    })
  }
}

/**
 * a shorthand for @Arg({nullable: true})
 */
export function ArgNullable(options: IArgOptions = {}): ParameterDecorator {
  return Arg({ ...options, nullable: true })
}
