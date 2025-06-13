import React from 'react';

export default function MapDisplay({ latitude, longitude }) {
  if (latitude == null || longitude == null) return null;
  const bbox = `${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  return (
    <iframe
      title="map"
      width="100%"
      height="200"
      style={{ border: 0 }}
      loading="lazy"
      src={src}
    />
  );
}
