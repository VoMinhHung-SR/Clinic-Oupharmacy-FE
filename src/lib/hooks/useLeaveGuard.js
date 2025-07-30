import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ConfirmAlert } from "../../config/sweetAlert2";

/**
 * Hook để bắt sự kiện khi người dùng chuyển trang và có unsaved changes
 * @param {boolean} hasUnsavedChanges - Nếu true thì sẽ hiển thị confirm alert khi chuyển trang
 * @param {Function} onClearForm - Callback được gọi khi user confirm để clear form
 */
const useLeaveGuard = (hasUnsavedChanges = false, onClearForm = null) => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (!hasUnsavedChanges) {
      prevLocation.current = location;
      return;
    }

    if (location !== prevLocation.current) {
      const allow = window.confirm("Bạn có chắc muốn rời trang này?");
      if (!allow) {
        // Quay lại location cũ
        navigate(-1); // hoặc navigate(prevLocation.current.pathname);
      } else {
        prevLocation.current = location; // cho phép update
      }
    }
  }, [location, hasUnsavedChanges, navigate]);
};

export default useLeaveGuard; 