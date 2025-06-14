import { useState, useEffect } from 'react';
import { fetchPlaceByInput } from '../../../common/components/Mapbox/services';

const useAddressSearch = (debouncedValue) => {
    const [searchState, setSearchState] = useState({
        listPlace: [],
        loading: false
    });

    useEffect(() => {
        const searchAddress = async () => {
            if (!debouncedValue) {
                setSearchState({ listPlace: [], loading: false });
                return;
            }

            try {
                setSearchState(prev => ({ ...prev, loading: true }));
                const res = await fetchPlaceByInput(debouncedValue);
                if (res.status === 200) {
                    setSearchState({
                        listPlace: res.data.predictions,
                        loading: false
                    });
                }
            } catch (err) {
                setSearchState({ listPlace: [], loading: false });
            }
        };

        searchAddress();
    }, [debouncedValue]);

    return searchState;
};

export default useAddressSearch; 