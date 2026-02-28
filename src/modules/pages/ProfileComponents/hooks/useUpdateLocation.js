import { useContext, useEffect, useState, useCallback } from "react";
import { fetchUserAddresses, createUserAddress, updateUserAddress } from "../services";
import { useTranslation } from "react-i18next";
import createToastMessage from "../../../../lib/utils/createToastMessage";
import { TOAST_SUCCESS } from "../../../../lib/constants";
import { ErrorAlert } from "../../../../config/sweetAlert2";
import UserContext from "../../../../lib/context/UserContext";
import { authApi, endpoints } from "../../../../config/APIs";

const normalizeAddressList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
};

const useUpdateLocation = () => {
  const { t } = useTranslation(["yup-validate", "modal"]);
  const { user, updateUser } = useContext(UserContext);
  const [locationData, setLocationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const handleChangeFlag = () => setFlag(!flag);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const res = await authApi().get(endpoints["current-user"]);
      if (res.status === 200) {
        updateUser(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [updateUser]);

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        const res = await fetchUserAddresses();
        if (res.status === 200 && res.data != null) {
          const list = normalizeAddressList(res.data);
          const defaultAddr =
            list.find((a) => a.is_default) || list[0] || null;
          setLocationData(defaultAddr);
        } else {
          setLocationData(null);
        }
      } catch (err) {
        console.log(err);
        setLocationData(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      loadAddressData();
    }
  }, [user, flag]);

  const onSubmit = (
    data,
    setError,
    locationGeo,
    cityName,
    districtName,
    callBackSuccess = () => {}
  ) => {
    if (!locationGeo?.lat || !locationGeo?.lng) {
      setError("location.address", {
        type: "custom",
        message: t("yupAddressMustBeSelected"),
      });
      return;
    }
    if (!cityName) {
      setError("location.city", {
        type: "custom",
        message: t("yupCityRequired"),
      });
      return;
    }
    if (!districtName) {
      setError("location.district", {
        type: "custom",
        message: t("yupDistrictRequired"),
      });
      return;
    }

    const payload = {
      lat: locationGeo.lat,
      lng: locationGeo.lng,
      city: data.location.city,
      district: data.location.district,
      address: data.location.address,
    };

    const runRequest = async () => {
      try {
        if (locationData == null) {
          const res = await createUserAddress({
            ...payload,
            is_default: true,
          });
          if (res.status === 201 || res.status === 200) {
            createToastMessage({
              message: t("modal:createSuccess"),
              type: TOAST_SUCCESS,
            });
            await refreshCurrentUser();
            handleChangeFlag();
            callBackSuccess();
          } else {
            ErrorAlert(
              t("modal:createFailed"),
              t("modal:pleaseDoubleCheck"),
              t("modal:ok")
            );
          }
        } else {
          const res = await updateUserAddress(locationData.id, payload);
          if (res.status === 200) {
            createToastMessage({
              message: t("modal:updateSuccess"),
              type: TOAST_SUCCESS,
            });
            await refreshCurrentUser();
            handleChangeFlag();
            callBackSuccess();
          } else {
            ErrorAlert(
              t("modal:updateFailed"),
              t("modal:pleaseDoubleCheck"),
              t("modal:ok")
            );
          }
        }
      } catch (err) {
        ErrorAlert(
          t("modal:updateFailed"),
          t("modal:pleaseDoubleCheck"),
          t("modal:ok")
        );
      }
    };

    runRequest();
  };

  return {
    locationData,
    onSubmit,
    handleChangeFlag,
    isLoading,
  };
};

export default useUpdateLocation;
