import { useCallback, useState } from "react";

import {
  CounterDummyComponent,
  type CounterDummyComponentProps,
} from "./counter";
import {
  counter_increment,
  counter_reset,
  counter_setInitialState,
} from "./counter-logic";

export const CounterEnhancedComponent = (props: CounterDummyComponentProps) => {
  const [count, setCount] = useState(0);

  // Use the hook directly in the component instead of in onMount callback
  counter_setInitialState(setCount);

  const onIncrement = useCallback(() => counter_increment(setCount), []);
  const onReset = useCallback(() => counter_reset(setCount), []);

  const mergedProps = {
    count,
    onIncrement,
    onReset,
  };

  return CounterDummyComponent({ ...mergedProps, ...props });
};
