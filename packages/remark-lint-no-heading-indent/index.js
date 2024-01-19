/**
 * remark-lint rule to warn when headings are indented.
 *
 * ## What is this?
 *
 * This package checks the spaces before headings.
 *
 * ## When should I use this?
 *
 * You can use this rule to check markdown code style.
 *
 * ## API
 *
 * ### `unified().use(remarkLintNoHeadingIndent)`
 *
 * Warn when headings are indented.
 *
 * ###### Parameters
 *
 * There are no options.
 *
 * ###### Returns
 *
 * Transform ([`Transformer` from `unified`][github-unified-transformer]).
 *
 * ## Recommendation
 *
 * There is no specific handling of indented headings (or anything else) in
 * markdown.
 * While it is possible to use an indent to headings on their text:
 *
 * ```markdown
 *    # Mercury
 *   ## Venus
 *  ### Earth
 * #### Mars
 * ```
 *
 * …such style is uncommon,
 * a bit hard to maintain,
 * and it’s impossible to add a heading with a rank of 5 as it would form
 * indented code instead.
 * So it’s recommended to not indent headings and to turn this rule on.
 *
 * ## Fix
 *
 * [`remark-stringify`][github-remark-stringify] formats headings without indent.
 *
 * [api-remark-lint-no-heading-indent]: #unifieduseremarklintnoheadingindent
 * [github-remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify
 * [github-unified-transformer]: https://github.com/unifiedjs/unified#transformer
 *
 * @module no-heading-indent
 * @author Titus Wormer
 * @copyright 2015 Titus Wormer
 * @license MIT
 *
 * @example
 *   {"name": "ok.md"}
 *
 *   #␠Mercury
 *
 *   Venus
 *   -----
 *
 *   #␠Earth␠#
 *
 *   Mars
 *   ====
 *
 * @example
 *   {"label": "input", "name": "not-ok.md"}
 *
 *   ␠␠␠# Mercury
 *
 *   ␠Venus
 *   ------
 *
 *   ␠# Earth #
 *
 *   ␠␠␠Mars
 *   ======
 * @example
 *   {"label": "output", "name": "not-ok.md"}
 *
 *    1:4: Unexpected `3` spaces before heading, expected `0` spaces, remove `3` spaces
 *    3:2: Unexpected `1` space before heading, expected `0` spaces, remove `1` space
 *    6:2: Unexpected `1` space before heading, expected `0` spaces, remove `1` space
 *    8:4: Unexpected `3` spaces before heading, expected `0` spaces, remove `3` spaces
 */

/**
 * @typedef {import('mdast').Root} Root
 */

import pluralize from 'pluralize'
import {lintRule} from 'unified-lint-rule'
import {pointStart} from 'unist-util-position'
import {visitParents} from 'unist-util-visit-parents'

const remarkLintNoHeadingIndent = lintRule(
  {
    origin: 'remark-lint:no-heading-indent',
    url: 'https://github.com/remarkjs/remark-lint/tree/main/packages/remark-lint-no-heading-indent#readme'
  },
  /**
   * @param {Root} tree
   *   Tree.
   * @returns {undefined}
   *   Nothing.
   */
  function (tree, file) {
    visitParents(tree, 'heading', function (node, parents) {
      const parent = parents[parents.length - 1]
      const start = pointStart(node)

      // Note: it’s rather complex to detect what the expected indent is in block
      // quotes and lists, so let’s only do directly in root for now.
      if (!start || !parent || parent.type !== 'root') {
        return
      }

      const actual = start.column - 1

      if (actual) {
        file.message(
          'Unexpected `' +
            actual +
            '` ' +
            pluralize('space', actual) +
            ' before heading, expected `0` spaces, remove' +
            ' `' +
            actual +
            '` ' +
            pluralize('space', actual),
          {ancestors: [...parents, node], place: start}
        )
      }
    })
  }
)

export default remarkLintNoHeadingIndent
