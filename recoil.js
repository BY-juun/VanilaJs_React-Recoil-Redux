import { getNextMonth } from "../utils/getNextMonth.js";
import { makeDay } from "../utils/makeDay.js";
import { render } from "./view.js";

const RecoilStore = new Map();

export function atom(Atom) {
  if (!Atom.hasOwnProperty("key")) return new Error("Atom은 중복되지 않은 key가 필요합니다");
  if (!Atom.hasOwnProperty("default")) return new Error("Atom은 기본 값이 필요합니다");
  if (RecoilStore.has(Atom.key)) return new Error("이미 존재하는 key값입니다");

  RecoilStore.set(Atom.key, Atom.default);
  return Atom;
}

export function useRecoilValue(atom) {
  return RecoilStore.get(atom.key);
}

export function useRecoilState(atom) {
  const state = RecoilStore.get(atom.key);
  const setState = useSetRecoilState();
  return [state, setState];
}

export function useSetRecoilState(atom) {
  const setState = (newState) => {
    RecoilStore.set(atom.key, newState);
    render();
  };
  return setState;
}

export function useRefreshRecoilState(atom) {
  const refresh = () => {
    RecoilStore.set(atom.key, atom.default);
    render();
  };
  return refresh;
}

/**
 * Selector를 만들어보자
 */

//아래는 Atom 사용 예제

// const now = new Date();
// const [nextYear, nextMonth] = getNextMonth(now.getFullYear(), now.getMonth() + 1);

// const leftCalendarInitVal = {
//   year: now.getFullYear(),
//   month: now.getMonth() + 1,
//   days: makeDay({ year: now.getFullYear(), month: now.getMonth() + 1 }),
// };

// const rightCalendarInitVal = {
//   year: nextYear,
//   month: nextMonth,
//   days: makeDay({ year: nextYear, month: nextMonth }),
// };

// export const LeftCalendarInfo = atom({
//   key: "LeftCalendarInfo",
//   default: leftCalendarInitVal,
// });

// export const RightCalendarInfo = atom({
//   key: "RightCalendarInfo",
//   default: rightCalendarInitVal,
// });
