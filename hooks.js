import { reducer } from "../store/index.js";
import { push } from "./router.js";
import { createStore } from "./store.js";
import { render } from "./view.js";

const states = new Map();

let effectIdx = 0;
const isExcute = [];
const effectsFn = [];
const cleanUpFn = [];

let prevDeps = [];
let curDeps = [];

let refIdx = 0;
const refBinder = [];

let store;

/**
 * Root의 자식 요소들이 변경 될 때마다 (render함수가 다시 실행될 때 마다)
 * useRef를 통해 할당된 값들의 ref를 바인딩해주고
 * useEffect를 통해 등록된 effect함수들을 실행시켜준다.
 */
new MutationObserver(() => {
  bindRef();
  executeEffects();
}).observe(document.querySelector("#root"), { childList: true });

/**
 * states를 배열로 관리하고 인덱스를 이용해 기존 state값을 다시 반환해주려는 시도를 했지만,
 * 컴포넌트의 렌더링 순서가 항상 일정하다고 보장을 할 수 없었다.
 * (ex, 1번 Case : 달력모달 -> 요금모달 => 달력모달의 useState먼저 호출 후, 요금 모달의 useState 호출)
 * (2번 Case : 요금모달 -> 달력모달 => 요금모달의 useState먼저 호출 후, 달력 모달의 useState 호출)
 * 1번과 2번 Case에서 useState 호출 순서가 달라, state가 꼬이는 상황 발생
 * 그래서 Map을 이용하도록 변경
 * 이럴 경우, 어디에서나 key값을 이용해 접근이 가능함 -> redux, Recoil만든거랑 뭐가 다르지?....
 */
export function useState(initState, key) {
  let state;
  if (states.has(key)) state = states.get(key);
  else {
    state = initState;
    states.set(key, initState);
  }

  const setState = (newState) => {
    states.set(key, newState);
    render();
  };

  return [state, setState];
}

export function useEffect(effectFn, deps) {
  const idx = effectIdx;
  curDeps.push(deps);
  if (effectsFn.length === effectIdx) {
    //새로운 effect 함수가 들어왔을 때,
    effectsFn.push(effectFn);
    isExcute.push(true);
  } else {
    // 기존에 있던 effect 함수,
    effectsFn[idx] = effectFn;

    if (isEventListener(deps))
      /**
       *  이벤트리스너 전용 useEffect를 의미한다.
       *  랜더링이 될 때마다 이벤트리스너를 다시 달아야 하기 때문에, executeFlag를 true로 만들어서,
       *  다시 이벤트리스너가 되도록
       */
      isExcute[idx] = true;
    else if (deps !== []) {
      //deps가 0이 아님 -> deps안의 값이 바뀌면, effect 함수가 다시 실행되어야 한다.
      if (isDiff(prevDeps[idx], curDeps[idx])) isExcute[idx] = true;
      //deps에 넣어둔 값이 바뀐 경우 다시 실행 해야 한다.
    }
  }
  effectIdx += 1;
}

export function useRef() {
  const refId = refIdx;
  const ref = { refId };
  refBinder.push(() => {
    ref.current = document.querySelector(`[ref="${refId}"]`);
  });
  refIdx += 1;
  return ref;
}

export function useHistory() {
  const history = {
    push: push,
  };
  return history;
}

export function useSearchParams() {
  const URLSearch = new URLSearchParams(location.search);
  return Object.fromEntries(URLSearch.entries());
}

export function initStore() {
  store = createStore(reducer);
  store.subscribe(render);
}

export function useDispatch() {
  return store.dispatch;
}

export function useSelector(selector) {
  //return selector(store.getState());
  return store.getState();
}

function bindRef() {
  refBinder.forEach((fn) => fn());
  refBinder.length = 0;
}

function executeEffects() {
  effectsFn.forEach((fn, idx) => {
    if (isExcute[idx]) {
      cleanUpFn.push(fn());
      isExcute[idx] = false;
    }
  });

  //현재 뎁스를 저장해서, 다음 useEffect 실행 시에, 값이 변경했는지 비교를 통해 확인하기 위해 저장
  prevDeps = [...curDeps];
  curDeps.length = 0;

  //다시 effect함수의 맨 앞을 볼 수 있도록 하기 위해서 초기화
  effectIdx = 0;
}

export function executeCleanUp() {
  /**
   * useEffect의 return 함수를 저장해놓지 않을 경우 제외 (cleanUp함수 지정 x -> undefined)
   */
  cleanUpFn.filter((el) => el !== undefined).forEach((fn) => fn());
  cleanUpFn.length = 0;
}

export function resetHooksIdx() {
  refIdx = 0;
}

export function initHooks() {
  states.clear();
  refIdx = 0;
  refBinder.length = 0;
  effectIdx = 0;
  effectsFn.length = 0;
  isExcute.length = 0;
  cleanUpFn.length = 0;
  prevDeps.length = 0;
  curDeps.length = 0;
}

function isDiff(prev, cur) {
  return JSON.stringify(prev, null) !== JSON.stringify(cur, null);
}

function isEventListener(deps) {
  return deps.length === 1 && deps[0] === "eventListener" ? true : false;
}
