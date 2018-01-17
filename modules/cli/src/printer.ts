import * as ts from 'typescript';
import * as _ from 'lodash';
import * as prettier from 'prettier';
import chalk from 'chalk';

import { ActionMetadata, collectMetadata } from './collect-metadata';
import * as path from './path-wrapper';
import * as fs from 'fs';

export function createActionOutput(
  filename: string,
  category: string,
  metadata: ActionMetadata[]
): [ts.ImportDeclaration, ts.TypeAliasDeclaration] {
  const importDeclaration = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(metadata.map(m => ts.createImportSpecifier(undefined, ts.createIdentifier(m.name))))
    ),
    ts.createIdentifier(`'./${filename.replace('.ts', '')}'`)
  );

  const typeUnionDeclaration = ts.createTypeAliasDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    `${_.upperFirst(_.camelCase(category))}Actions`,
    undefined,
    ts.createUnionTypeNode(metadata.map(m => ts.createTypeReferenceNode(m.name, undefined)))
  );

  return [importDeclaration, typeUnionDeclaration];
}

export function parseActionType(type: string) {
  const actionTypeRegex = new RegExp(/\[(.*?)\](.*)/);
  const result = actionTypeRegex.exec(type);

  if (result === null) {
    throw new Error(`Could not parse action type "${type}"`);
  }

  return {
    category: (result[1] as string).replace(/(\.|-|\s)/, ''),
    name: result[2] as string
  };
}

export function readSource(sourceFilePath: string): [string, string, ts.SourceFile] {
  const paths = sourceFilePath.split('/');
  const [sourceFileName] = paths.slice(-1);
  const sourceFileFolder = sourceFilePath.replace(`/${sourceFileName}`, '');

  console.log(chalk.blue(`Reading source file from ${sourceFilePath}...`));
  const sourceFile = ts.createSourceFile(
    `${sourceFileName}`,
    fs.readFileSync(path.resolve(`${sourceFilePath}`)).toString(),
    ts.ScriptTarget.ES2015,
    true
  );

  return [sourceFileName, sourceFileFolder, sourceFile];
}

export function generateFileOutput(sourceFilePath: string, option = false) {
  const [sourceFileName, sourceFileFolder, sourceFile] = readSource(sourceFilePath);

  const resultFileName = sourceFileName.replace(/\.ts$/, '') + '.helper.ts';

  console.log(chalk.blue('Collecting metadata...'));
  const metadata = collectMetadata(sourceFile);
  console.log(chalk.blue('Generating result file...'));
  const { category } = parseActionType(metadata[0].type);
  const [importDeclaration, typeUnionDeclaration] = createActionOutput(
    `${sourceFileName.replace(/\.ts$/, '')}`,
    category,
    metadata
  );
  let ast: ts.Statement[] = [importDeclaration, typeUnionDeclaration];
  if (option) {
    ast = [...ast, createReducerOutput(category, typeUnionDeclaration.name, metadata)];
  }
  printFile(sourceFileFolder, resultFileName, ast);
}

export function printFile(fileFolder: string, fileName: string, ast: ts.Statement[]) {
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const resultFile = ts.createSourceFile(`${fileName}`, '', ts.ScriptTarget.ES2015, false, ts.ScriptKind.TS);
  const sourceText = prettier.format(
    ast.map(statement => printer.printNode(ts.EmitHint.Unspecified, statement, resultFile)).join('\n\n'),
    { singleQuote: true, printWidth: 120 }
  );

  console.log(chalk.blue(`Writing result file to ${fileFolder}/${fileName}`));
  fs.writeFileSync(path.resolve(`${fileFolder}/${fileName}`), sourceText, {
    encoding: 'utf8'
  });
}

export function createReducerOutput(
  featureModuleName: string,
  actionUnionType: ts.Identifier,
  metadata: ActionMetadata[]
) {
  const reducerDeclaration = ts.createFunctionDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    undefined,
    `${_.camelCase(featureModuleName)}Reducer`,
    undefined,
    [
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        'state',
        undefined,
        ts.createTypeReferenceNode('any', undefined),
        undefined
      ),
      ts.createParameter(
        undefined,
        undefined,
        undefined,
        'action',
        undefined,
        ts.createTypeReferenceNode(actionUnionType, undefined)
      )
    ],
    ts.createTypeReferenceNode('any', undefined),
    ts.createBlock(
      [
        ts.createSwitch(
          ts.createPropertyAccess(ts.createIdentifier('action'), 'type'),
          ts.createCaseBlock([
            ...metadata.map(m => {
              return ts.createCaseClause(ts.createLiteral(m.type), [
                ts.createReturn(ts.createObjectLiteral([ts.createSpreadAssignment(ts.createIdentifier('state'))], true))
              ]);
            }),
            ts.createDefaultClause([ts.createReturn(ts.createIdentifier('state'))])
          ])
        )
      ],
      true
    )
  );

  return reducerDeclaration;
}
