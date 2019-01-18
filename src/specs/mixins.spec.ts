import { graphql, printSchema } from 'graphql'
import { ObjectType, Field, SchemaRoot, Query, compileSchema } from '../index'

interface IHasMyProp {
  myProp: number
}

class Mixin {
  @Field()
  mixinMethod(this: IHasMyProp, a: string): string {
    expect(this.myProp).toBe(5)
    return `hello from mixin ${a}`
  }
  // TODO enable this test when https://github.com/Microsoft/TypeScript/issues/29427 is resolved
  // mixinMethodWithContext(this: IHasMyProp, a: string, @Context ctx: any): string {
  //   expect(this.myProp).toBe(5)
  //   return `hello from mixin ${a}`
  // }
}

@ObjectType({ mixins: [Mixin] })
class Hello implements IHasMyProp {
  myProp = 5
  @Field()
  world(name: string): string {
    return `Hello, ${name}`
  }
}

@SchemaRoot()
class FooSchema {
  @Query()
  hello(): Hello {
    return new Hello()
  }
}

const schema = compileSchema(FooSchema)

describe('Query a mixin method', () => {
  it('executes and field method has correct context', async () => {
    const result = await graphql(
      schema,
      `
        {
          hello {
            mixinMethod(a: "Bob")
          }
        }
      `
    )

    expect(result).toMatchSnapshot()
  })

  it('throws', async () => {
    @ObjectType({ mixins: [undefined] })
    class Hello implements IHasMyProp {
      myProp = 5
      @Field()
      world(name: string): string {
        return `Hello, ${name}`
      }
    }

    @SchemaRoot()
    class FooSchema {
      @Query()
      hello(): Hello {
        return new Hello()
      }
    }

    expect(() => {
      compileSchema(FooSchema)
    }).toThrowErrorMatchingInlineSnapshot(
      `"expected a mixin on Hello to be a Class, instead value of index 0 is undefined"`
    )
  })

  it('accepts a thunk to avoid circular refs', async () => {
    class Mixin {
      @Field()
      mixinMethod(this: IHasMyProp, a: string): string {
        expect(this.myProp).toBe(5)
        return `hello from mixin ${a}`
      }
    }
    let mixinSimulatedAsCircularDep: Function | undefined = undefined

    @ObjectType({ mixins: () => [mixinSimulatedAsCircularDep] })
    class Hello implements IHasMyProp {
      myProp = 5
      @Field()
      world(name: string): string {
        return `Hello, ${name}`
      }
    }

    @SchemaRoot()
    class FooSchema {
      @Query()
      hello(): Hello {
        return new Hello()
      }
    }

    let schemaCompiled
    expect(() => {
      mixinSimulatedAsCircularDep = Mixin

      schemaCompiled = compileSchema(FooSchema)
    }).not.toThrow()
    expect(printSchema(schemaCompiled)).toMatchSnapshot()
  })
})
