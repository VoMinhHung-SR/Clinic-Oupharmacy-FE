import { useState, useEffect, useCallback, useMemo } from 'react';
import useDebounce from '../../../../lib/hooks/useDebounce';
import { fetchPlaceById } from '../../../common/components/Mapbox/services';
import { fetchDistrictsByCity } from '../services';
import useAddressSearch from './useAddressSearch';
import { createFilterOptions } from '@mui/material';

const useAddressInfo = () => {
    const [addressState, setAddressState] = useState({
        districts: [],
        cityId: null,
        cityName: '',
        districtName: '',
        addressInput: '',
        location: { lat: "", lng: "" },
        selectedOption: null
    });

    const debouncedValue = useDebounce(addressState.addressInput, 500);
    const { listPlace, loading } = useAddressSearch(debouncedValue);

    const handleSetLocation = useCallback(() => {
        setAddressState(prev => ({
            ...prev,
            location: { lat: "", lng: "" }
        }));
    }, []);

    useEffect(() => {
        const loadDistricts = async (cityId) => {
            const res = await fetchDistrictsByCity(cityId);
            if (res.status === 200) {
                setAddressState(prev => ({
                    ...prev,
                    districts: res.data
                }));
            } else {
                setAddressState(prev => ({
                    ...prev,
                    districts: []
                }));
            }
        };

        if (addressState.cityId) {
            loadDistricts(addressState.cityId);
        }
    }, [addressState.cityId]);

    const handleGetPlaceByID = useCallback(async (placeId) => {
        const res = await fetchPlaceById(placeId);
        if (res.status === 200) {
            setAddressState(prev => ({
                ...prev,
                location: {
                    lat: res.data.result.geometry.location.lat,
                    lng: res.data.result.geometry.location.lng
                }
            }));
        }
    }, []);

    const handleInputChange = useCallback((event, value) => {
        setAddressState(prev => ({
            ...prev,
            addressInput: value
        }));
    }, []);

    const handleChange = useCallback((event, value) => {
        if (value) {
            handleGetPlaceByID(value.place_id);
            setAddressState(prev => ({
                ...prev,
                selectedOption: value,
                addressInput: value.description
            }));
        } else {
            setAddressState(prev => ({
                ...prev,
                selectedOption: null,
                addressInput: '',
                location: { lat: "", lng: "" }
            }));
        }
    }, [handleGetPlaceByID]);

    const memoizedFilterOptions = useMemo(() => createFilterOptions({
        matchFrom: 'start',
        stringify: (option) => option?.description || ""
    }), []);

    return {
        ...addressState,
        listPlace,
        loading,
        handleInputChange,
        handleChange,
        handleSetLocation,
        filterOptions: memoizedFilterOptions,
        setCityId: (id) => setAddressState(prev => ({ ...prev, cityId: id })),
        setCityName: (name) => setAddressState(prev => ({ ...prev, cityName: name })),
        setDistrictName: (name) => setAddressState(prev => ({ ...prev, districtName: name }))
    };
};

export default useAddressInfo;