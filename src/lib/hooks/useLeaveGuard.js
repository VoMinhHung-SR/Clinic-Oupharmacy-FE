import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConfirmAlert } from "../../config/sweetAlert2";

/**
 * Hook để bắt sự kiện khi người dùng chuyển trang và có unsaved changes
 * @param {boolean} hasUnsavedChanges - Nếu true thì sẽ hiển thị confirm alert khi chuyển trang
 * @param {Function} onClearForm - Callback được gọi khi user confirm để clear form
 */
const useLeaveGuard = (hasUnsavedChanges = false, onClearForm = null) => {
  const { t } = useTranslation('modal');
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  const isNavigatingRef = useRef(false);
  const isConfirmedRef = useRef(false);
  const hasAddedStateRef = useRef(false);

  const handleBeforeUnload = useCallback((e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = ""; // required for Chrome
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (hasUnsavedChanges && !hasAddedStateRef.current) {
      window.history.pushState({ unsavedChanges: true }, '', location.pathname);
      hasAddedStateRef.current = true;
    }
  }, [hasUnsavedChanges, location.pathname]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handlePopState = (event) => {
      if (event.state && event.state.unsavedChanges) {
        event.preventDefault();
        
        ConfirmAlert(
          t('unsavedChangesTitle'),
          t('unsavedChangesMessage'),
          t('yes'),
          t('cancel'),
          () => {
            if (onClearForm) {
              onClearForm();
            }
            isConfirmedRef.current = true;
            isNavigatingRef.current = true;
            window.history.go(-1);
          },
          () => {
            window.history.pushState({ unsavedChanges: true }, '', location.pathname);
          }
        );
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedChanges, onClearForm, t, location.pathname]);

  useEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousPathRef.current;

    if (currentPath !== previousPath && hasUnsavedChanges && !isNavigatingRef.current && !isConfirmedRef.current) {
      ConfirmAlert(
        t('unsavedChangesTitle'),
        t('unsavedChangesMessage'),
        t('yes'),
        t('cancel'),
        () => {
          if (onClearForm) {
            onClearForm();
          }
          isConfirmedRef.current = true;
          isNavigatingRef.current = true;
        },
        () => {
          window.history.pushState(null, '', previousPath);
        }
      );
    }

    previousPathRef.current = currentPath;
  }, [location.pathname, hasUnsavedChanges, onClearForm, t]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [handleBeforeUnload]);

  useEffect(() => {
    isNavigatingRef.current = false;
    isConfirmedRef.current = false;
    hasAddedStateRef.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      if (hasUnsavedChanges && !isNavigatingRef.current && !isConfirmedRef.current) {
        ConfirmAlert(
          t('unsavedChangesTitle'),
          t('unsavedChangesMessage'),
          t('yes'),
          t('cancel'),
          () => {
            if (onClearForm) {
              onClearForm();
            }
            isConfirmedRef.current = true;
            isNavigatingRef.current = true;
            originalPushState.apply(this, args);
          },
          () => {
          }
        );
        return;
      }
      originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      if (hasUnsavedChanges && !isNavigatingRef.current && !isConfirmedRef.current) {
        ConfirmAlert(
          t('unsavedChangesTitle'),
          t('unsavedChangesMessage'),
          t('yes'),
          t('cancel'),
          () => {
            if (onClearForm) {
              onClearForm();
            }
            isConfirmedRef.current = true;
            isNavigatingRef.current = true;
            originalReplaceState.apply(this, args);
          },
          () => {
          }
        );
        return;
      }
      originalReplaceState.apply(this, args);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [hasUnsavedChanges, onClearForm, t]);

  return {
    hasUnsavedChanges,
    currentPath: location.pathname
  };
};

export default useLeaveGuard; 