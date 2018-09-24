(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{"./docs/explore/hooks/authorization-example.mdx":function(e,n,a){"use strict";a.r(n);var o=a("./node_modules/react/index.js"),t=a.n(o),r=a("./node_modules/@mdx-js/tag/dist/index.js");function s(e,n){if(null==e)return{};var a,o,t=function(e,n){if(null==e)return{};var a,o,t={},r=Object.keys(e);for(o=0;o<r.length;o++)a=r[o],n.indexOf(a)>=0||(t[a]=e[a]);return t}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)a=r[o],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(t[a]=e[a])}return t}n.default=function(e){var n=e.components;s(e,["components"]);return t.a.createElement(r.MDXTag,{name:"wrapper",components:n},t.a.createElement(r.MDXTag,{name:"h1",components:n,props:{id:"authorization-example-with-before-hook"}},"Authorization example with @Before hook"),t.a.createElement(r.MDXTag,{name:"p",components:n},t.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"@Before")," hook is great for use-cases like authorization because:"),t.a.createElement(r.MDXTag,{name:"ul",components:n},t.a.createElement(r.MDXTag,{name:"li",components:n,parentName:"ul"},"it is executed before field resolver itself"),t.a.createElement(r.MDXTag,{name:"li",components:n,parentName:"ul"},"if any of ",t.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"li"},"@Before")," hooks will return promise - it will be resolved before field itself is resolved"),t.a.createElement(r.MDXTag,{name:"li",components:n,parentName:"ul"},"if any of ",t.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"li"},"@Before")," will throw error, resolving will be instantly stopped")),t.a.createElement(r.MDXTag,{name:"p",components:n},"Very basic authorization model could look like:"),t.a.createElement(r.MDXTag,{name:"pre",components:n},t.a.createElement(r.MDXTag,{name:"code",components:n,parentName:"pre",props:{className:"language-js"}},"import { ObjectType, Field, Before } from 'decapi'\n\n@ObjectType()\nclass User {\n  @Field()\n  name: string\n\n  @Before(({ context }) => {\n    if (!context.isUserAuthorized()) {\n      throw new Error('Unauthorized to know this')\n    }\n  })\n  @Field()\n  isBanned: boolean\n}\n")),t.a.createElement(r.MDXTag,{name:"p",components:n},"In such case, we're checking graphql context before we'll allow access to field itself."),t.a.createElement(r.MDXTag,{name:"h2",components:n,props:{id:"creating-reusable-hooks"}},"Creating reusable hooks"),t.a.createElement(r.MDXTag,{name:"p",components:n},"Authorization like in example above is very likely to be required in many places in any graphql schema."),t.a.createElement(r.MDXTag,{name:"p",components:n},"We could simply create custom hook that can be easily re-used:"),t.a.createElement(r.MDXTag,{name:"pre",components:n},t.a.createElement(r.MDXTag,{name:"code",components:n,parentName:"pre",props:{className:"language-js"}},"import { ObjectType, Field, Before } from 'decapi'\n\nfunction AdminOnly(errorMessage: string = 'Unauthorized') {\n  return Before(({ context }) => {\n    if (!context.isAdmin()) {\n      throw new Error(errorMessage)\n    }\n  })\n}\n\n@ObjectType()\nclass User {\n  @Field()\n  name: string\n\n  @AdminOnly()\n  @Field()\n  isBanned: boolean\n\n  @AdminOnly('Only admin can see this information')\n  @Field()\n  isEmailConfirmed: boolean\n}\n")),t.a.createElement(r.MDXTag,{name:"h2",components:n,props:{id:"object-aware-authorization-eg-only-i-can-see-my-email-address"}},"Object aware authorization (eg. only I can see my email address)"),t.a.createElement(r.MDXTag,{name:"p",components:n},"Quite often access level for every given object depends on who is seeing it. Let's say we want only admin or owner of account to be able to see email address of ",t.a.createElement(r.MDXTag,{name:"inlineCode",components:n,parentName:"p"},"User"),":"),t.a.createElement(r.MDXTag,{name:"pre",components:n},t.a.createElement(r.MDXTag,{name:"code",components:n,parentName:"pre",props:{className:"language-js"}},"import { ObjectType, Field, Before } from 'decapi'\n\nfunction AdminOrAccountOwner(errorMessage: string = 'Unauthorized') {\n  return Before(async ({ context, source }) => {\n    if (context.isCurrentUserAdmin()) {\n      return // allow for admin\n    }\n\n    // note that we can use async functions inside hooks\n    if (source.id === (await context.getCurrentUserId())) {\n      return // allow if accessing user id is the same as accessed user id\n    }\n\n    throw new Error(errorMessage)\n  })\n}\n\n@ObjectType()\nclass User {\n  @Field()\n  id: string\n\n  @AdminOrAccountOwner()\n  @Field()\n  email: string\n}\n")))}}}]);