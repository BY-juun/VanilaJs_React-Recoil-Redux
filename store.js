export function createStore(reducer) {
  const subscriber = new Set();
  let state = reducer();

  const frozenState = {};

  Object.keys(state).forEach((key) => {
    Object.defineProperty(frozenState, key, {
      get: () => state[key], // get만 정의하여 set을 하지 못하도록 만드는 것이다.
    });
  });
  const getState = () => frozenState;

  const subscribe = (subscriberFn) => {
    subscriber.add(subscriberFn);
  };

  const dispatch = (action) => {
    state = reducer(state, action);
    publish();
  };

  const publish = () => subscriber.forEach((subscriberFn) => subscriberFn());

  return { getState, subscribe, dispatch };
}
