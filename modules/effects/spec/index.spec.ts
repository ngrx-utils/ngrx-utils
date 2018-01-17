import { ofAction } from '../index';
import { Action as NgRxAction } from '@ngrx/store';
import { of } from 'rxjs/observable/of';

describe('@ngrx-utils/effects', () => {
  it('filters actions', () => {
    class MyAction implements NgRxAction {
      readonly type = 'myaction';
      constructor(public payload: any) {}
    }

    class MyAction2 implements NgRxAction {
      readonly type = 'myaction2';
    }

    class MyAction3 implements NgRxAction {
      readonly type = 'myaction3';
      constructor(public foo: any, public bar: any) {}
    }

    const action = new MyAction('foo'),
      action2 = new MyAction2(),
      action3 = new MyAction3('a', 0);
    const actions = of<NgRxAction>(action, action2, action3);
    const tappedActions: NgRxAction[] = [];
    actions.pipe(ofAction(MyAction, MyAction2)).subscribe(a => {
      tappedActions.push(a);
    });

    expect(tappedActions.length).toEqual(2);
    expect(tappedActions[0]).toBe(action);
    expect(tappedActions[1]).toBe(action2);
  });
});
