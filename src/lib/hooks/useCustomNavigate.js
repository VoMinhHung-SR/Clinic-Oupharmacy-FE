import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConfirmAlert } from "../../config/sweetAlert2";

/**
 * Hook để chặn routing và đi tiếp khi user confirm
 * @param {Object} options - Các options cho hook
 * @param {boolean} options.isDirty - Trạng thái form có thay đổi hay không
 * @param {Function} options.onClearForm - Hàm xử lý clear form
 * @param {Function} options.onBeforeNavigate - Hàm chạy trước khi chuyển trang
 * @param {Function} options.onAfterNavigate - Hàm chạy sau khi chuyển trang
 */
const useCustomNavigate = ({
  isDirty = false,
  onClearForm = null,
  onBeforeNavigate = null,
  onAfterNavigate = null
} = {}) => {
  const { t } = useTranslation('modal');
  const navigate = useNavigate();
  const location = useLocation();
  const isInterceptingRef = useRef(false);

  // Intercept history changes
  useEffect(() => {
    if (!isDirty) return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      if (isDirty && !isInterceptingRef.current) {
        // Block navigation và hiển thị confirm
        ConfirmAlert(
          t('unsavedChangesTitle'),
          t('unsavedChangesMessage'),
          t('yes'),
          t('cancel'),
          () => {
            // User confirm - cho phép navigation
            if (onClearForm) {
              onClearForm();
            }
            isInterceptingRef.current = true;
            originalPushState.apply(this, args);
            isInterceptingRef.current = false;
          },
          () => {
            // User cancel - không làm gì
          }
        );
        return;
      }
      originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      if (isDirty && !isInterceptingRef.current) {
        ConfirmAlert(
          t('unsavedChangesTitle'),
          t('unsavedChangesMessage'),
          t('yes'),
          t('cancel'),
          () => {
            if (onClearForm) {
              onClearForm();
            }
            isInterceptingRef.current = true;
            originalReplaceState.apply(this, args);
            isInterceptingRef.current = false;
          },
          () => {}
        );
        return;
      }
      originalReplaceState.apply(this, args);
    };

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [isDirty, onClearForm, t]);

  // Intercept popstate (back/forward buttons)
  useEffect(() => {
    if (!isDirty) return;

    const handlePopState = (event) => {
      if (isDirty && !isInterceptingRef.current) {
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
            isInterceptingRef.current = true;
            window.history.go(-1);
            isInterceptingRef.current = false;
          },
          () => {
            // Push current state back
            window.history.pushState(null, '', location.pathname);
          }
        );
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isDirty, onClearForm, t, location.pathname]);

  const customNavigate = useCallback((to, options = {}) => {
    if (isDirty) {
      ConfirmAlert(
        t('unsavedChangesTitle'),
        t('unsavedChangesMessage'),
        t('yes'),
        t('cancel'),
        () => {
          // User confirm
          if (onClearForm) {
            onClearForm();
          }
          if (onBeforeNavigate) {
            onBeforeNavigate(to, options);
          }
          navigate(to, options);
          if (onAfterNavigate) {
            onAfterNavigate(to, options);
          }
        },
        () => {}
      );
    } else {
      // Normal navigation
      if (onBeforeNavigate) {
        onBeforeNavigate(to, options);
      }
      navigate(to, options);
      if (onAfterNavigate) {
        onAfterNavigate(to, options);
      }
    }
  }, [isDirty, onClearForm, onBeforeNavigate, onAfterNavigate, navigate, t]);

  return {
    navigate: customNavigate,
    currentPath: location.pathname
  };
};

export default useCustomNavigate;