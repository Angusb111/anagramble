"use client";

type KeyRowProps = {
  items: string[];
  onKeyPress: (key: string) => void;
};

export function CustomKeyRow({ items, onKeyPress }: KeyRowProps) {
  return (
    <div className="flex flex-row gap-5 justify-center items-center">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => onKeyPress(item)}
          className="bg-olive-500 dark:bg-gray-600 w-14 h-14 flex items-center justify-center font-semibold text-xl rounded-sm
                    active:scale-90 active:bg-gray-500 transition-transform duration-75"
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}