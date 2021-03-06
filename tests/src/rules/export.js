import { test } from '../utils'

import { RuleTester } from 'eslint'

var ruleTester = new RuleTester()
  , rule = require('../../../lib/rules/export')

ruleTester.run('export', rule, {
  valid: [
    // default
    test({ code: 'var foo = "foo"; export default foo;' }),
    test({ code: 'export var foo = "foo"; export var bar = "bar";'}),
    test({ code: 'export var foo = "foo", bar = "bar";' }),
    test({ code: 'export var { foo, bar } = object;' }),
    test({ code: 'export var [ foo, bar ] = array;' }),
    test({ code: 'export var { foo, bar } = object;' }),
    test({ code: 'export var [ foo, bar ] = array;' }),
    test({ code: 'export { foo, foo as bar }' }),
    test({
      code: 'export { bar }; export * from "./export-all"',
      settings: { 'import/parse-options': { plugins: ['exportExtensions']}},
    }),
    test({
      code: 'export * from "./export-all"',
      settings: { 'import/parse-options': { plugins: ['exportExtensions']}},
    }),
    test({ code: 'export * from "./does-not-exist"' }),
  ],

  invalid: [
    // multiple defaults
    test({ code: 'export default foo; export default bar'
         , errors: 2 }),
    test({ code: 'export default function foo() {}; ' +
                 'export default function bar() {}'
         , errors: 2 }),
    test({ code: 'export function foo() {}; ' +
                 'export { bar as foo }'
         , errors: 2 }),
    test({ code: 'export {foo}; export {foo};'
         , errors: 2 }),
    test({ code: 'export {foo}; export {bar as foo};'
         , errors: 2 }),
    test({ code: 'export var foo = "foo"; export var foo = "bar";'
         , errors: 2 }),
    test({ code: 'export var foo = "foo", foo = "bar";'
         , errors: 2 }),
    test({
      code: 'export { foo }; export * from "./export-all"',
      settings: { 'import/parse-options': { plugins: ['exportExtensions']}},
      errors: ['Multiple exports of name \'foo\'.',
               'Multiple exports of name \'foo\'.'],
    }),
    test({ code: 'export * from "./default-export"'
         , errors: [{ message: 'No named exports found in module ' +
                               '\'./default-export\'.'
                    , type: 'Literal' }] }),

    test({
      code: 'export * from "./malformed.js"',
      errors: [{
        message: "Parse errors in imported module './malformed.js'.",
        type: 'Literal',
      }],
    }),

    test({
      code: 'export var { foo, bar } = object; export var foo = "bar"',
      errors: ['Multiple exports of name \'foo\'.',
               'Multiple exports of name \'foo\'.'],
    }),
    test({
      code: 'export var { bar: { foo } } = object; export var foo = "bar"',
      errors: ['Multiple exports of name \'foo\'.',
               'Multiple exports of name \'foo\'.'],
    }),
    test({
      code: 'export var [ foo, bar ] = array; export var bar = "baz"',
      errors: ['Multiple exports of name \'bar\'.',
               'Multiple exports of name \'bar\'.'],
    }),
    test({
      code: 'export var [ foo, /*sparse*/, { bar } ] = array; export var bar = "baz"',
      errors: ['Multiple exports of name \'bar\'.',
               'Multiple exports of name \'bar\'.'],
    }),

  ],
})
