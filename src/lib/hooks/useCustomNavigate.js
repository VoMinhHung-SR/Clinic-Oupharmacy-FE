import { useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConfirmAlert } from "../../config/sweetAlert2";

/**
 * Hook to block routing and proceed when user confirms
 * @param {Object} options - Options for the hook
 * @param {Boolean} options.shouldBlock - Navigation blocking state
 * @param {Function} options.onClearForm - Function to handle form clearing
 * @param {Function} options.onBeforeNavigate - Function to run before navigation
 * @param {Function} options.onAfterNavigate - Function to run after navigation
 */
const useCustomNavigate = ({
  shouldBlock = false,
  onClearForm = null,
  onBeforeNavigate = null,
  onAfterNavigate = null
} = {}) => {
  const { t } = useTranslation('modal');
  const navigate = useNavigate();
  const location = useLocation();
  const isConfirmingRef = useRef(false);

  const customNavigate = useCallback((to, options = {}) => {
    if (isConfirmingRef.current) return;

    if (shouldBlock) {
      isConfirmingRef.current = true;
      
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
          isConfirmingRef.current = false;
        },
        () => {
          // User cancel
          isConfirmingRef.current = false;
        }
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
  }, [shouldBlock, onClearForm, onBeforeNavigate, onAfterNavigate, navigate, t]);

  // Intercept history changes
  useEffect(() => {
    if (!shouldBlock) return;

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      if (shouldBlock && !isConfirmingRef.current) {
        const targetPath = args[2];
        
        isConfirmingRef.current = true;
        
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
            // navigation
            navigate(targetPath);
            isConfirmingRef.current = false;
          },
          () => {
            // User cancel
            isConfirmingRef.current = false;
          }
        );
        return;
      }
      originalPushState.apply(this, args);
    };

    window.history.replaceState = function(...args) {
      if (shouldBlock && !isConfirmingRef.current) {
        const targetPath = args[2];
        
        isConfirmingRef.current = true;
        
        ConfirmAlert(
          t('unsavedChangesTitle'),
          t('unsavedChangesMessage'),
          t('yes'),
          t('cancel'),
          () => {
            if (onClearForm) {
              onClearForm();
            }
            navigate(targetPath, { replace: true });
            isConfirmingRef.current = false;
          },
          () => {
            isConfirmingRef.current = false;
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
  }, [shouldBlock, onClearForm, navigate, t]);

  return {
    navigate: customNavigate,
    currentPath: location.pathname
  };
};

export default useCustomNavigate;