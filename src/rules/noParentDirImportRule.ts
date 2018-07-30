/**
 * @license
 * Copyright 2017 Palantir Technologies, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { findImports, ImportKind } from 'tsutils';

import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
    /* tslint:disable:object-literal-sort-keys */
    static metadata = {
        ruleName: 'no-parent-dir-import',
        description: 'Disallows imports from parent directory',
        rationale: Lint.Utils.dedent`
            enforces relative path usage either from baseUrl or specialized paths (e.g. @common/)
        `,
        optionsDescription: 'Not configurable.',
        options: null,
        optionExamples: [true, 'allowed-file-name'] as any,
        type: 'functionality' as any,
        typescriptOnly: false,
        hasFix: false,
    };
    /* tslint:enable:object-literal-sort-keys */

    static FAILURE_STRING = 'Import from parent directory';

    static PARENT_DIR = '../';

    apply(sourceFile: any) {
        return this.applyWithFunction(sourceFile, walk.bind(this));
    }
}

function walk(this: Rule, ctx: any) {
    const whitelist = this.getOptions().ruleArguments || [];

    for (const name of findImports(ctx.sourceFile, ImportKind.All)) {
        if (name.text.indexOf(Rule.PARENT_DIR) !== -1 && !whitelist.some((allowedName) => name.text.indexOf(allowedName) === -1)) {
            ctx.addFailure(name.getStart(ctx.sourceFile) + 1, name.end - 1, Rule.FAILURE_STRING);
        }
    }
}
