import { executeCleanUp, resetHooksIdx } from "./hooks.js";

let root, component;
export function appInit(rootInit, componentInit) {
  root = rootInit;
  component = componentInit;
  render();
}

const debounceFrame = (callback) => {
  let nextFrameCallback = -1;
  return () => {
    cancelAnimationFrame(nextFrameCallback);
    nextFrameCallback = requestAnimationFrame(callback);
  };
};

/**
 * setState, dispatch, setRecoilState가 연속해서 발생할 경우
 * 연속해서 렌더링이 일어나는 것을 방지하기 위해, 사용
 */
export const render = debounceFrame(() => {
  executeCleanUp();
  resetHooksIdx();
  root.innerHTML = component();
});
