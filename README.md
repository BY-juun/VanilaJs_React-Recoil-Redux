# 추가 혹은 기능 개선

1. useState 재정의 및 구현
   - 현재 useState는 Map과 key를 활용 중 (recoil, redux랑 다른점이 없음)
   - 인덱스로 배열에 접근해서 state를 가져오는 방식은 컴포넌트 호출 순서가 달라지면 고이는 문제 발생
   - ex) A컴포넌트 이후 B컴포넌트 호출, A컴포넌트에 있는 useState가 B컴포넌트에 있는 useState보다 먼저 호출 -> state 배열 안에서 A컴포넌트의 state들이 앞에 위치
   - ex) 그러나 B컴포넌트 이후, A컴포넌트가 호출되면 B컴포넌트의 state들이 A컴포넌트의 state들 보다 앞에 위치
   - 따라서 이런 문제를 해결하려면, 배열을 이용하는 방식을 바꾸거나, 렌더링 순서가 항상 일관되게 유지되도록 해야한다.
2. useState와 Recoil 컴포넌트 단위 구독

   - 현재는 전체 리랜더링 -> 구독 혹은 사용하고 있는 컴포넌트만 리랜더링 되도록

3. Recoil Selector 기능 추가

4. Redux 비동기 기능 추가 (saga 혹은 thunk 기능)
