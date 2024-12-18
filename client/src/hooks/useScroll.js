import { useRef } from "react";

export default function useScroll() {
  const scrollRef = useRef();
  const scroll = (direction) => {
    const {current} = scrollRef;
    direction === "left"
      ? (current.scrollLeft -= 600)
      : (current.scrollLeft += 600);
  };

  return { scroll, scrollRef };
}
