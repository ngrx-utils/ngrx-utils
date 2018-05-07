import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';
import * as ts from 'typescript';

export type ActionHelperOptions = {
  /**
   * The path to create the pipe.
   */
  path: string;
};

type ActionMetadata = {
  feature: string;
  eventSource: string;
  actionType: string;
  className: string;
};

export default function(options: ActionHelperOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
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

    const actionMetadata: ActionMetadata[] = [];
    const actionHashTable: { [action: string]: string } = {};

    actionClasses.forEach(cls => {
      const classEl = cls.members.filter((m): m is ts.PropertyDeclaration => {
        if (ts.isPropertyDeclaration(m)) {
          return m.name.getText() === 'type';
        }

        return false;
      })[0];

      if (cls.name == null) {
        throw new SchematicsException(
          `You MUST specify the name of action class: \n` + `${cls.getText()}`
        );
      }

      const className = cls.name.getText();

      if (classEl.initializer == null) {
        throw new SchematicsException(
          `You MUST initialize the action type of class '${className}'!`
        );
      }

      const action = classEl.initializer.getText().replace(/'/g, '');

      if (actionHashTable[action] !== undefined) {
        throw new SchematicsException(
          `Duplicated '${action}' in '${className}' and '${actionHashTable[action]}'`
        );
      }

      const actionTypeRegex = new RegExp(/\[(.+)\.(.+)\](.+)/);
      const result = actionTypeRegex.exec(action);

      if (result == null) {
        throw new SchematicsException(`Could not parse action type '${action}'`);
      }

      actionHashTable[action] = className;
      actionMetadata.push({
        className,
        feature: result[1].replace(/\s/g, ''),
        eventSource: result[2].replace(/\s/g, ''),
        actionType: result[3].replace(/\s/g, '')
      });
    });

    console.log(actionMetadata);

    return host;
  };
}
