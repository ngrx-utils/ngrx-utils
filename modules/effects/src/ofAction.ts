import { Action } from '@ngrx/store';
import { OperatorFunction } from 'rxjs/interfaces';
import { filter } from 'rxjs/operators';

import { ActionType } from './symbols';

export function ofAction<T extends Action = Action>(allowedType: ActionType<T>): OperatorFunction<Action, T>;
export function ofAction<A extends Action, B extends Action>(
  a: ActionType<A>,
  b: ActionType<B>
): OperatorFunction<Action, A | B>;
export function ofAction<A extends Action, B extends Action, C extends Action>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>
): OperatorFunction<Action, A | B | C>;
export function ofAction<A extends Action, B extends Action, C extends Action, D extends Action>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>,
  d: ActionType<D>
): OperatorFunction<Action, A | B | C | D>;
export function ofAction<A extends Action, B extends Action, C extends Action, D extends Action, E extends Action>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>,
  d: ActionType<D>,
  e: ActionType<E>
): OperatorFunction<Action, A | B | C | D | E>;
export function ofAction<
  A extends Action,
  B extends Action,
  C extends Action,
  D extends Action,
  E extends Action,
  F extends Action
>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>,
  d: ActionType<D>,
  e: ActionType<E>,
  f: ActionType<F>
): OperatorFunction<Action, A | B | C | D | E | F>;
export function ofAction<
  A extends Action,
  B extends Action,
  C extends Action,
  D extends Action,
  E extends Action,
  F extends Action,
  G extends Action
>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>,
  d: ActionType<D>,
  e: ActionType<E>,
  f: ActionType<F>,
  g: ActionType<G>
): OperatorFunction<Action, A | B | C | D | E | F | G>;
export function ofAction<
  A extends Action,
  B extends Action,
  C extends Action,
  D extends Action,
  E extends Action,
  F extends Action,
  G extends Action,
  H extends Action
>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>,
  d: ActionType<D>,
  e: ActionType<E>,
  f: ActionType<F>,
  g: ActionType<G>,
  h: ActionType<H>
): OperatorFunction<Action, A | B | C | D | E | F | G | H>;
export function ofAction<
  A extends Action,
  B extends Action,
  C extends Action,
  D extends Action,
  E extends Action,
  F extends Action,
  G extends Action,
  H extends Action,
  I extends Action
>(
  a: ActionType<A>,
  b: ActionType<B>,
  c: ActionType<C>,
  d: ActionType<D>,
  e: ActionType<E>,
  f: ActionType<F>,
  g: ActionType<G>,
  h: ActionType<H>,
  i: ActionType<I>
): OperatorFunction<Action, A | B | C | D | E | F | G | H | I>;
/**
 * Could have better type variable here when Variadic types in typescript land
 * https://github.com/Microsoft/TypeScript/issues/5453
 */
export function ofAction<T extends Action = Action>(...actions: ActionType[]): OperatorFunction<Action, T> {
  return filter<Action, T>((action: Action): action is T => actions.some(a => action instanceof a));
}
