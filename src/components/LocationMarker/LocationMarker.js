import { useState } from "react";
import { PopupComponent } from "../index";
import { Marker } from "react-map-gl";
import styles from './LocationMarker.module.css';

const LocationMarker = ({ geometries, categories }) => {

  const [selectedEvent, setSelectedEvent] = useState(null);
  const longitude = geometries[0].coordinates[0];
  const latitude = geometries[0].coordinates[1];
  const title = categories[0].title;
  const iconName = title.split(" ")[0].toLowerCase();

  const openPopup = (popupInfo) => {
    setSelectedEvent(popupInfo);
  }

  const closePopup = (selectedEvent) => {
    setSelectedEvent(selectedEvent);
  }

  return longitude && latitude ? (
    <>
      <Marker latitude={latitude} longitude={longitude}>
        <div onClick={() => openPopup({latitude, longitude, title})}>
          <img
            className={styles.icon}
            src={process.env.PUBLIC_URL + `/icons/${iconName}.png`}
            alt={`${title}-icon`}
          />
        </div>
      </Marker>
      {selectedEvent && (
        <PopupComponent handleClose={closePopup} {...selectedEvent}/>
      )}
    </>
  ) : (
    ""
  );
};

export default LocationMarker;
