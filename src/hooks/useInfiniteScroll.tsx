import { useCallback, useEffect, RefObject } from 'react';

const useInfiniteScroll = (
  bodyRef: RefObject<HTMLElement | null>,
  bottomLineRef: RefObject<HTMLElement | null>,
  callback: () => void
): void => {
  const handleScroll = useCallback(() => {
    const containerHeight = bodyRef?.current?.getBoundingClientRect().height || 0;

    const bottomLineRect = bottomLineRef?.current?.getBoundingClientRect();
    const bottomLineTop = bottomLineRect ? bottomLineRect.top : 0;

    if (bottomLineTop <= containerHeight) {
      callback();
    }
  }, [bodyRef, bottomLineRef, callback]);

  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);
    return () => bodyRefCurrent?.removeEventListener('scroll', handleScroll, true);
  }, [bodyRef, handleScroll]);
};

export default useInfiniteScroll;
