import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  createUserAddress,
  fetchUserAddresses,
  updateUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
} from "../services";
import UserContext from "../../../../lib/context/UserContext";
import createToastMessage from "../../../../lib/utils/createToastMessage";
import { TOAST_SUCCESS } from "../../../../lib/constants";
import { ErrorAlert } from "../../../../config/sweetAlert2";
import { authApi, endpoints } from "../../../../config/APIs";

const useUserAddresses = () => {
  const { t } = useTranslation(["yup-validate", "modal"]);
  const { user, updateUser } = useContext(UserContext);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFromServer = useCallback(async () => {
    try {
      const res = await fetchUserAddresses();
      if (res.status === 200 && Array.isArray(res.data)) {
        setAddresses(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const res = await authApi().get(endpoints["current-user"]);
      if (res.status === 200) {
        updateUser(res.data);
        const list = Array.isArray(res.data.addresses) ? res.data.addresses : [];
        setAddresses(list);
      }
    } catch (error) {
      console.log(error);
    }
  }, [updateUser]);

  useEffect(() => {
    if (user && Array.isArray(user.addresses)) {
      setAddresses(user.addresses);
      setIsLoading(false);
    } else {
      loadFromServer();
    }
  }, [user, loadFromServer]);

  const validateAndBuildPayload = (
    data,
    setError,
    locationGeo,
    cityName,
    districtName
  ) => {
    if (!locationGeo.lat || !locationGeo.lng) {
      setError("location.address", {
        type: "custom",
        message: t("yupAddressMustBeSelected"),
      });
      return null;
    }
    if (!cityName) {
      setError("location.city", {
        type: "custom",
        message: t("yupCityRequired"),
      });
      return null;
    }
    if (!districtName) {
      setError("location.district", {
        type: "custom",
        message: t("yupDistrictRequired"),
      });
      return null;
    }

    return {
      address: data.location.address,
      lat: locationGeo.lat,
      lng: locationGeo.lng,
      city: data.location.city,
      district: data.location.district,
    };
  };

  const handleCreateAddress = (
    data,
    setError,
    locationGeo,
    cityName,
    districtName,
    callBackSuccess = () => {}
  ) => {
    const payloadBase = validateAndBuildPayload(
      data,
      setError,
      locationGeo,
      cityName,
      districtName
    );
    if (!payloadBase) return;

    const payload = {
      ...payloadBase,
      is_default: addresses.length === 0,
    };

    const createAddress = async () => {
      try {
        const res = await createUserAddress(payload);
        if (res.status === 201 || res.status === 200) {
          createToastMessage({
            message: t("modal:createSuccess"),
            type: TOAST_SUCCESS,
          });
          await refreshCurrentUser();
          callBackSuccess();
        } else {
          ErrorAlert(
            t("modal:createFailed"),
            t("modal:pleaseDoubleCheck"),
            t("modal:ok")
          );
        }
      } catch (error) {
        ErrorAlert(
          t("modal:createFailed"),
          t("modal:pleaseDoubleCheck"),
          t("modal:ok")
        );
      }
    };

    createAddress();
  };

  const handleUpdateAddress = (
    addressId,
    data,
    setError,
    locationGeo,
    cityName,
    districtName,
    callBackSuccess = () => {}
  ) => {
    const payload = validateAndBuildPayload(
      data,
      setError,
      locationGeo,
      cityName,
      districtName
    );
    if (!payload) return;

    const updateAddress = async () => {
      try {
        const res = await updateUserAddress(addressId, payload);
        if (res.status === 200) {
          createToastMessage({
            message: t("modal:updateSuccess"),
            type: TOAST_SUCCESS,
          });
          await refreshCurrentUser();
          callBackSuccess();
        } else {
          ErrorAlert(
            t("modal:updateFailed"),
            t("modal:pleaseDoubleCheck"),
            t("modal:ok")
          );
        }
      } catch (error) {
        ErrorAlert(
          t("modal:updateFailed"),
          t("modal:pleaseDoubleCheck"),
          t("modal:ok")
        );
      }
    };

    updateAddress();
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const res = await deleteUserAddress(addressId);
      if (res.status === 204 || res.status === 200) {
        createToastMessage({
          message: t("modal:deleteSuccess"),
          type: TOAST_SUCCESS,
        });
        await refreshCurrentUser();
      } else {
        ErrorAlert(
          t("modal:deleteFailed"),
          t("modal:pleaseDoubleCheck"),
          t("modal:ok")
        );
      }
    } catch (error) {
      ErrorAlert(
        t("modal:deleteFailed"),
        t("modal:pleaseDoubleCheck"),
        t("modal:ok")
      );
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const res = await setDefaultUserAddress(addressId);
      if (res.status === 200) {
        createToastMessage({
          message: t("modal:updateSuccess"),
          type: TOAST_SUCCESS,
        });
        await refreshCurrentUser();
      } else {
        ErrorAlert(
          t("modal:updateFailed"),
          t("modal:pleaseDoubleCheck"),
          t("modal:ok")
        );
      }
    } catch (error) {
      ErrorAlert(
        t("modal:updateFailed"),
        t("modal:pleaseDoubleCheck"),
        t("modal:ok")
      );
    }
  };

  return {
    addresses,
    isLoading,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleSetDefaultAddress,
  };
};

export default useUserAddresses;

