import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';
import * as prettier from 'prettier';
import { InsertChange } from '../utility/change';

export type ActionHelperOptions = {
  /**
   * The path to create the pipe.
   */
  path: string;
};

type ActionMetadata = {
  featureName: string;
  eventSource: string;
  actionType: string;
  className: string;
  actionFullText: string;
};

export default function(options: ActionHelperOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    // TODO: Handle path glob
    const path = options.path;

    const text = host.read(path);
    if (text === null) {
      throw new SchematicsException(`File ${path} does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    const source = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true);
    const statements: ts.NodeArray<ts.Statement> = source.statements;
    const actionClasses = statements.filter((st): st is ts.ClassDeclaration => {
      if (ts.isClassDeclaration(st)) {
        const heritageClauses = st.heritageClauses;
        if (heritageClauses) {
          return heritageClauses.some(clause =>
            clause.types.some(t => t.expression.getText() === 'Action')
          );
        }
      }

      return false;
    });

    // TODO: Move outside for multi action declaration files
    const actionHashTable: { [action: string]: string } = {};

    const featureMap: {
      [feature: string]: ActionMetadata[];
    } = {};

    actionClasses.forEach(cls => {
      if (cls.name == null) {
        throw new SchematicsException(
          `You MUST specify the name of action class: \n` + `${cls.getText()}`
        );
      }

      const actionTypeProp = cls.members.filter((m): m is ts.PropertyDeclaration => {
        if (ts.isPropertyDeclaration(m)) {
          return m.name.getText() === 'type';
        }

        return false;
      })[0];

      const className = cls.name.text;

      if (actionTypeProp.initializer == null) {
        throw new SchematicsException(
          `You MUST initialize the action type of class '${className}'!`
        );
      }

      const actionFullText = actionTypeProp.initializer.getText().replace(/'/g, '');

      if (actionHashTable[actionFullText] !== undefined) {
        throw new SchematicsException(
          `Duplicated '${actionFullText}' in '${className}' and '${
            actionHashTable[actionFullText]
          }'`
        );
      }

      const actionTypeRegex = /\[(.+)\.(.+)\](.+)/;
      const actionTypeNoSourceRegex = /\[(.+)(.*)\](.+)/;
      const result =
        actionTypeRegex.exec(actionFullText) || actionTypeNoSourceRegex.exec(actionFullText);

      if (result == null) {
        throw new SchematicsException(
          `Could not parse action type '${actionFullText}' \n` +
            `You should follow action type convention: '[Feature.EventSource] Interaction Event'`
        );
      }

      actionHashTable[actionFullText] = className;

      const featureName = result[1].replace(/\s/g, '');
      let feature = featureMap[featureName];

      if (feature === undefined) {
        feature = featureMap[featureName] = [];
      }

      feature.push({
        className,
        featureName,
        actionFullText,
        eventSource: result[2].replace(/\s/g, ''),
        actionType: result[3].replace(/\s/g, '')
      });
    });

    const outputs: ts.NodeArray<ts.Statement> = Object.keys(featureMap)
      .map(featureName => {
        const feature = featureMap[featureName];
        const typeAliasDeclaration = ts.createTypeAliasDeclaration(
          undefined,
          [ts.createToken(ts.SyntaxKind.ExportKeyword)],
          `${featureName}ActionUnion`,
          undefined,
          ts.createUnionTypeNode(
            feature.map(m => ts.createTypeReferenceNode(m.className, undefined))
          )
        );

        const enumDeclaration = ts.createEnumDeclaration(
          undefined,
          [ts.createToken(ts.SyntaxKind.ExportKeyword)],
          `${featureName}ActionType`,
          feature.map(m =>
            ts.createEnumMember(
              `${m.eventSource}${m.actionType}`,
              ts.createLiteral(m.actionFullText)
            )
          )
        );

        const generated: ts.NodeArray<ts.Statement> = [];

        return [enumDeclaration, typeAliasDeclaration] as ts.NodeArray<ts.Statement>;
      })
      .reduce((acc, cur) => [...acc, ...cur]);

    const result = [
      ...statements.filter(st => !ts.isEnumDeclaration(st) && !ts.isTypeAliasDeclaration(st)),
      ...outputs
    ].map(st => new InsertChange(st));

    // TODO: Prettier read config from file and provide option as fallback
    const recorder = host.beginUpdate(path);

    return host.overwrite(
      path,
      prettier.format(result, { parser: 'typescript', singleQuote: true })
    );
  };
}
