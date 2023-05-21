import React, { useState, Fragment } from "react";
import Places from "./Places";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

function App() {
  const [mapRef, setMapRef] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [markerMap, setMarkerMap] = useState({});
  const [center, setCenter] = useState({});
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [infoOpen, setInfoOpen] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDzaUIJOE2L5qTrD4CXFKG1UsiNG8eOZtw",
  });

  const fitBounds = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    Places.map((place) => {
      bounds.extend(place.pos);
      return place.id;
    });
    map.fitBounds(bounds);
  };

  const loadHandler = (map) => {
    setMapRef(map);
    fitBounds(map);
  };

  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    setSelectedPlace(place);
    if (infoOpen) {
      setInfoOpen(false);
    }
    setInfoOpen(true);
  };

  const renderMap = () => {
    return (
      <Fragment>
        <GoogleMap
          onLoad={loadHandler}
          onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
          onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
          center={center}
          mapContainerStyle={{
            height: "300px",
            width: "900px",
            margin: "auto",
          }}
        >
          {Places.map((place) => (
            <Marker
              key={place.id}
              position={place.pos}
              onLoad={(marker) => markerLoadHandler(marker, place)}
              onClick={(event) => markerClickHandler(event, place)}
              icon={{
                icon: "https://gasdeverao.cocacola.com.br/assets/favicons/favicon-32x32.png",
                fillColor: "red",
              }}
            />
          ))}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <a href={selectedPlace.link}>
                  <h3>{selectedPlace.title}</h3>
                  <div>{selectedPlace.description}</div>
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </Fragment>
    );
  };
  return isLoaded ? renderMap() : null;
}

export default App;
