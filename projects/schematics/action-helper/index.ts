import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

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

    /**
     * Remove all declared Enum, Type Alias and use the new output
     * for shake of simplicity.
     */
    // TODO: Lookup output Enum and Type Alias to see whether these should be removed
    const actionTypeEnum = statements.filter(ts.isEnumDeclaration);
    const actionTypeAlias = statements.filter(ts.isTypeAliasDeclaration);

    // TODO: Move outside for multi action declaration files
    const actionHashTable: { [action: string]: string } = {};

    const featureMap: { [feature: string]: ActionMetadata[] } = {};

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

      const actionTypeRegex = new RegExp(/\[(.+)\.(.+)\](.+)/);
      const actionTypeNoSourceRegex = new RegExp(/\[(.+)(.*)\](.+)/);
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

      if (featureMap[featureName] === undefined) {
        featureMap[featureName] = [];
      }

      featureMap[featureName].push({
        className,
        featureName,
        actionFullText,
        eventSource: result[2].replace(/\s/g, ''),
        actionType: result[3].replace(/\s/g, '')
      });
    });

    const outputs = Object.keys(featureMap).map(featureName => {
      const typeAliasDeclaration = ts.createTypeAliasDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        `${featureName}ActionUnion`,
        undefined,
        ts.createUnionTypeNode(
          featureMap[featureName].map(m => ts.createTypeReferenceNode(m.className, undefined))
        )
      );

      const enumDeclaration = ts.createEnumDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        `${featureName}ActionType`,
        featureMap[featureName].map(m =>
          ts.createEnumMember(`${m.eventSource}${m.actionType}`, ts.createLiteral(m.actionFullText))
        )
      );

      const actionGroup = actionClasses.filter(cls =>
        featureMap[featureName].some(f => f.className === cls.name!.getText())
      );

      return {
        actionEnum: enumDeclaration,
        actionTypeAlias: typeAliasDeclaration,
        actionGroup
      };
    });

    return host;
  };
}
