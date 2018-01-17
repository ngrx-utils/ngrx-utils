import * as ts from 'typescript';

export interface ActionMetadata {
  name: string;
  type: string;
}

export function getActionClasses(tsSourceFile: ts.SourceFile): ts.ClassDeclaration[] {
  const statements = tsSourceFile.statements;
  const classImplementsAction: ts.ClassDeclaration[] = statements.filter(
    (statement): statement is ts.ClassDeclaration => {
      if (ts.isClassDeclaration(statement)) {
        const heritageClauses = statement.heritageClauses;

        if (heritageClauses) {
          return heritageClauses.some(clause => {
            return clause.types.some(type => type.expression.getText() === 'Action');
          });
        }
      }
      return false;
    }
  );
  return classImplementsAction;
}

export function collectMetadata(tsSourceFile: ts.SourceFile): ActionMetadata[] {
  const implementsActionClasses = getActionClasses(tsSourceFile);

  const actionMetadata = implementsActionClasses.map(cls => {
    const classProperties: ts.ClassElement[] = cls.members.filter(ts.isClassElement);

    const typeProperty = classProperties.find(member => {
      return member.name!.getText() === 'type';
    });

    if (typeProperty === undefined) {
      throw new Error(`Could not find "type" property on class "${cls.name!.getText()}"`);
    }

    return {
      name: cls.name!.getText(),
      type: typeProperty
        .getText()
        .replace(/(readonly )?type = /, '')
        .replace(/;$/, '')
        .replace(/('|")/g, '')
    };
  });

  return actionMetadata;
}
