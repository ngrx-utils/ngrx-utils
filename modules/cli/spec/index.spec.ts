import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from '../src/path-wrapper';

import { getActionClasses, collectMetadata } from '../src/collect-metadata';
import { createReducerOutput, createActionOutput, parseActionType } from '../src/printer';

describe('@ngrx-utils/cli', () => {
  let sourceFile: ts.SourceFile;

  beforeEach(() => {
    sourceFile = ts.createSourceFile(
      `sample.actions.ts`,
      fs.readFileSync(path.resolve(__dirname, `./fixtures/sample.action.ts`)).toString(),
      ts.ScriptTarget.ES2015,
      true
    );
  });

  it('should get correct Union Action Class', () => {
    const actionClasses = getActionClasses(sourceFile);

    const unionTypeStr =
      'GetTruckItems | GetTruckItemsSuccess | GetTruckItemsFail | RefreshTruckItems' +
      ' | GetTruckData | GetTruckDataSuccess | GetTruckDataFail | RefreshTruckData';

    const unionType = actionClasses
      .map(actionClass => {
        return actionClass.name!.getText();
      })
      .join(' | ');

    expect(unionType).toBe(unionTypeStr);
  });

  it('should get correct property metadata', () => {
    const metas = collectMetadata(sourceFile);

    const metasStr = [
      {
        name: 'GetTruckItems',
        type: '[Truck] Get Truck Items'
      },
      {
        name: 'GetTruckItemsSuccess',
        type: '[Truck] Get Truck Items Success'
      },
      {
        name: 'GetTruckItemsFail',
        type: '[Truck] Get Truck Items Fail'
      },
      {
        name: 'RefreshTruckItems',
        type: '[Truck] Refresh Truck Items'
      },
      {
        name: 'GetTruckData',
        type: '[Truck] Get Truck Data'
      },
      {
        name: 'GetTruckDataSuccess',
        type: '[Truck] Get Truck Data Success'
      },
      {
        name: 'GetTruckDataFail',
        type: '[Truck] Get Truck Data Fail'
      },
      {
        name: 'RefreshTruckData',
        type: '[Truck] Refresh Truck Data'
      }
    ];

    expect(metas).toEqual(metasStr);
  });

  it('should generate correct reducer function', () => {
    const metas = collectMetadata(sourceFile);
    const [_, typeUnion] = createActionOutput('sample.action', 'Truck', metas);
    const { category } = parseActionType(metas[0].type);
    const ast = createReducerOutput(category, typeUnion.name, metas);
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const resultFile = ts.createSourceFile('sample.reducer.ts', '', ts.ScriptTarget.ES2015, false, ts.ScriptKind.TS);
    const sourceText = printer.printNode(ts.EmitHint.Unspecified, ast, resultFile);
    expect(sourceText).toMatch(/.*default: return state;.*/);
  });
});

describe('canonical-path', function() {
  describe('normalize', function() {
    it('should return a normalized path only using forward slashes', function() {
      expect(path.normalize('a/c/../b')).toEqual('a/b');
      // test on windows
      // expect(path.normalize('a\\c\\..\\b')).toEqual('a/b');
    });
  });

  describe('join', function() {
    it('should join paths only using forward slashes', function() {
      expect(path.join('a/b', 'c/d')).toEqual('a/b/c/d');
      // test on windows
      // expect(path.join('a\\b', 'c\\d')).toEqual('a/b/c/d');
    });
  });

  describe('canonical', function() {
    it('should return a path with forward slashes', function() {
      expect(path.canonical('a' + path.sep + 'b' + path.sep + 'c')).toEqual('a/b/c');
    });
  });
});
