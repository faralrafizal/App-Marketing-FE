"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import MarkerIcon from "../../../node_modules/leaflet/dist/images/marker-icon.png";
import MarkerShadow from "../../../node_modules/leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapsPage = ({ setCoordinate, coordinate, w = "70vw", h = "40vh" }) => {
  const [position, setPosition] = useState([0, 0]);

  useEffect(() => {
    setPosition([coordinate.lat || 0, coordinate.long || 0]);
  }, [coordinate?.lat]);
  if (position[0]) {
    return (
      <div>
        <MapContainer
          style={{
            height: h,
            width: w,
          }}
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          dragging={false}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            icon={
              new L.Icon({
                iconUrl: MarkerIcon.src,
                iconRetinaUrl: MarkerIcon.src,
                iconSize: [25, 41],
                iconAnchor: [12.5, 41],
                popupAnchor: [0, -41],
                shadowUrl: MarkerShadow.src,
                shadowSize: [41, 41],
              })
            }
            position={position}
          >
            <Popup>
              Posisi anda saat ini
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }
};

export default MapsPage;
