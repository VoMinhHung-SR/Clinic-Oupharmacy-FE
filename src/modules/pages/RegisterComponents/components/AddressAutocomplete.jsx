import React, { forwardRef } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AddressAutocomplete = React.memo(forwardRef(({
    value,
    onChange,
    onInputChange,
    options,
    loading,
    error,
    filterOptions,
    ...props
}, ref) => {
    const { t } = useTranslation(['register', 'common']);

    return (
        <Autocomplete
            freeSolo
            inputValue={value || ''}
            options={options || []}
            loading={loading}
            getOptionLabel={option => {
                if (!option) return '';
                if (typeof option === 'string') return option;
                if (typeof option.description === 'string') return option.description;
                return '';
            }}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                if (typeof option === 'string' && typeof value === 'string') return option === value;
                return option?.id === value?.id;
            }}
            noOptionsText={"No Option"}
            onInputChange={onInputChange}
            onChange={onChange}
            renderInput={params => (
                <TextField
                    {...params}
                    label={t('address')}
                    error={error}
                    inputRef={ref}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            {...props}
        />
    );
}));

export default AddressAutocomplete; 