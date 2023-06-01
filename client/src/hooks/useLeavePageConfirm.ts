import { useEffect } from "react";

export function useLeavePageConfirm() {
  useEffect(() => {
    const onPageLeave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', onPageLeave);

    return () => {
      window.removeEventListener('beforeunload', onPageLeave);
    }
  }, []);
}
