import {
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  chain
} from '@angular-devkit/schematics';
import * as fg from 'fast-glob';
import * as ts from 'typescript';
import * as prettier from 'prettier';

import { insertImport } from '../utility/route-utils';
import { Schema as ActionHelperOptions } from './schema';
import { InsertChange, RemoveChange } from '../utility/change';
import { findNodes } from '../utility/ast-utils';

type ActionMetadata = {
  actionName: string;
  actionType: string;
  featureName: string;
};

function generateHelper(path: string, actionMap: { [action: string]: ActionMetadata }): Rule {
  return (host: Tree) => {
    const buffer = host.read(path);
    if (buffer === null) {
      throw new SchematicsException(`File ${path} does not exist.`);
    }

    const sourceText = buffer.toString('utf-8');
    const source = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true);

    const actionTypesEnums = findNodes(source, ts.SyntaxKind.EnumDeclaration).filter(
      (st): st is ts.EnumDeclaration => st.getText().includes('ActionTypes')
    );

    const actionMetadata: { [feature: string]: ActionMetadata[] } = {};

    const declaredActions = findNodes<ts.ClassDeclaration>(source, ts.SyntaxKind.ClassDeclaration)
      .filter(
        cls =>
          cls.heritageClauses
            ? cls.heritageClauses.some(cl => cl.getText().includes('Action'))
            : false
      )
      .map(cls => (cls.name ? cls.name.getText() : 'default'));

    actionTypesEnums.forEach(e =>
      e.members.forEach(m => {
        const featureName = e.name.getText().replace('ActionTypes', '');
        const actionName = m.name.getText();
        if (m.initializer === undefined) {
          throw new SchematicsException(
            `You need to initialize the ${actionName} at Enum ${m.parent!.name.getText()}!`
          );
        }

        const actionType = m.initializer.getText().replace(/'/g, '');

        let action = actionMap[actionType];

        if (action !== undefined) {
          throw new SchematicsException(
            `Duplicated '${actionType}' in Enum: '${featureName}ActionTypes', Action: '${actionName}' ` +
              `and Enum: '${action.featureName}ActionTypes', Action: ${action.actionName}`
          );
        }

        action = { actionName, actionType, featureName };

        actionMap[actionType] = action;

        if (actionMetadata[featureName] === undefined) {
          actionMetadata[featureName] = [];
        }

        if (!declaredActions.includes(action.actionName)) {
          actionMetadata[featureName].push(action);
        }
      })
    );

    const importAction = insertImport(source, path, 'Action', '@ngrx/store');

    const toRemove: RemoveChange[] = [];

    const actionHelpers = Object.keys(actionMetadata)
      .map(featureName => {
        const actionMetaList = actionMetadata[featureName];
        if (actionMetaList.length === 0) {
          return '';
        }

        const declaredTypeAlias = findNodes(source, ts.SyntaxKind.TypeAliasDeclaration)
          .filter(n => n.getText().includes(`${featureName}Actions`))
          .pop();

        let typeAliasDeclaration: string;
        if (declaredTypeAlias !== undefined) {
          typeAliasDeclaration =
            declaredTypeAlias.getText().replace(';', '') +
            ` | ${actionMetaList.map(f => f.actionName).join(' | ')};`;

          toRemove.push(
            new RemoveChange(path, declaredTypeAlias.getStart(), declaredTypeAlias.getText())
          );
        } else {
          typeAliasDeclaration = `
            export type ${featureName}Actions = ${actionMetaList
            .map(f => f.actionName)
            .join(' | ')};
          `;
        }

        const actionClassDeclarations = actionMetaList
          .map(action => {
            const { actionName } = action;
            return `
              export class ${actionName} implements Action {
                readonly type = ${featureName}ActionTypes.${actionName};
              }
            `;
          })
          .join('');

        return `\n${actionClassDeclarations}\n${typeAliasDeclaration}`;
      })
      .join('\n');

    const insertHelper = new InsertChange(
      path,
      source.getEnd(),
      prettier.format(actionHelpers, { singleQuote: true, parser: 'typescript' })
    );

    const recorder = host.beginUpdate(path);
    for (const change of [importAction, insertHelper, ...toRemove]) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }

      if (change instanceof RemoveChange) {
        recorder.remove(change.pos - 1, change.toRemove.length + 1);
      }
    }

    host.commitUpdate(recorder);

    return host;
  };
}

export default function(options: ActionHelperOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    const pattern = options.pattern;
    const glob = pattern.replace(/\s/g, '').split(',');

    const entries = fg.sync([...glob]);

    const actionHashTable: { [action: string]: ActionMetadata } = {};

    return chain([...entries.map(e => generateHelper(e as string, actionHashTable))])(
      host,
      context
    );
  };
}
