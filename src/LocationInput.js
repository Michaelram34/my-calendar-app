import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';

export default function LocationInput({ value, onChange }) {
  const [input, setInput] = useState(value?.address || '');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!input || input.length < 3) {
      setOptions([]);
      return;
    }
    let active = true;
    setLoading(true);
    const controller = new AbortController();
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        input
      )}`,
      { signal: controller.signal, headers: { 'Accept-Language': 'en' } }
    )
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setOptions(data);
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
      controller.abort();
    };
  }, [input]);

  const handleSelect = (_, newValue) => {
    if (newValue) {
      setInput(newValue.display_name);
      onChange &&
        onChange({
          address: newValue.display_name,
          latitude: parseFloat(newValue.lat),
          longitude: parseFloat(newValue.lon),
          placeId: newValue.osm_id,
        });
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.display_name || option}
      filterOptions={(x) => x}
      onInputChange={(_, newInput) => setInput(newInput)}
      inputValue={input}
      onChange={handleSelect}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Location"
          fullWidth
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
    />
  );
}
