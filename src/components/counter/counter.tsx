export interface CounterDummyComponentProps {
  count?: number;
  onIncrement?: () => void;
  onReset?: () => void;
}

export const CounterDummyComponent = (props: CounterDummyComponentProps) => {
  const { count, onIncrement = () => {}, onReset = () => {} } = props;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="bg-foreground text-background cursor-pointer rounded p-2"
        onClick={() => onIncrement()}
      >
        count is {count}
      </button>
      <button
        className="bg-foreground text-background cursor-pointer rounded p-2"
        onClick={() => onReset()}
      >
        Reset
      </button>
    </div>
  );
};
