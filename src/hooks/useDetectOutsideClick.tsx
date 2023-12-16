import { useEffect, useState, RefObject, Dispatch, SetStateAction } from 'react';

type UseDetectOutsideClickProps = {
  ref: RefObject<HTMLElement | null>;
  initialState: boolean;
};

const useDetectOutsideClick = ({ ref, initialState }: UseDetectOutsideClickProps): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [isActive, setIsActive] = useState<boolean>(initialState);

  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (ref.current !== null && !ref.current.contains(event.target as Node)) {
        setIsActive((prev) => !prev);
      }
    };

    if (isActive) {
      window.addEventListener('mousedown', onClick);
    }

    return () => {
      window.removeEventListener('mousedown', onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive];
};

export default useDetectOutsideClick;
