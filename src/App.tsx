import { useState } from "react";
import "./App.css";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react/typed";
import { Tile3DLayer } from "@deck.gl/geo-layers/typed";

import { CesiumIonLoader } from "@loaders.gl/3d-tiles";

const ION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YWRkMDhkOC0zMGVhLTRjMDctODZmOS0yZTIyZWVmODlhYmQiLCJpZCI6MTM5MTQ0LCJpYXQiOjE2ODQyNTE1NzZ9.rK_BUFuEaa7OTZqmTXRPnMeqq6_HJp6W2Zd6mZuuZ7c";
const TILESET_URL_LIDAR = `https://assets.ion.cesium.com/1694762/tileset.json`;
const TILESET_URL_BUILDINGS = `https://assets.ion.cesium.com/75343/tileset.json`;

const INITIAL_VIEW_STATE = {
  latitude: 40.7018,
  longitude: -74.0008,
  pitch: 45,
  maxPitch: 60,
  bearing: 0,
  minZoom: 2,
  maxZoom: 30,
  zoom: 17,
};

function App() {
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);
  const [shouldShowPoints, setShouldShowPoints] = useState<boolean>(true);
  const [shouldShowBuildings, setShouldShowBuildings] = useState<boolean>(true);

  const onTilesetLoad = (tileset: any) => {
    // Recenter view to cover the new tileset
    const { cartographicCenter, zoom } = tileset;
    setInitialViewState({
      ...INITIAL_VIEW_STATE,
      longitude: cartographicCenter[0],
      latitude: cartographicCenter[1],
      zoom,
    });
  };

  const layers = [
    new Tile3DLayer({
      id: "tile-3d-layer",
      pointSize: 1,
      data: TILESET_URL_LIDAR,
      loader: CesiumIonLoader,
      loadOptions: { "cesium-ion": { accessToken: ION_TOKEN } },
      onTilesetLoad,
      getPointColor: [124, 185, 232, 255],
      visible: shouldShowPoints,
    }),
    new Tile3DLayer({
      id: "3d-buildings",
      pointSize: 1,
      data: TILESET_URL_BUILDINGS,
      loader: CesiumIonLoader,
      loadOptions: { "cesium-ion": { accessToken: ION_TOKEN } },
      onTilesetLoad,
      getPointColor: [185, 120, 232, 255],
      visible: shouldShowBuildings,
    }),
  ];

  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "100px",
          backgroundColor: "#fff",
          zIndex: "1000",
          color: "#000",
          borderRadius: "5px",
          padding: "1rem",
          textAlign: "left",
        }}
      >
        <input
          type="checkbox"
          id="points"
          name="points"
          checked={shouldShowPoints}
          onChange={(e) => setShouldShowPoints(e.target.checked)}
        />
        <label htmlFor="points">Show Point Cloud</label>
        <br />
        <input
          type="checkbox"
          id="buildings"
          name="buildings"
          checked={shouldShowBuildings}
          onChange={(e) => setShouldShowBuildings(e.target.checked)}
        />
        <label htmlFor="buildings">Show 3D Buildings</label>
      </div>
      <DeckGL
        layers={layers}
        initialViewState={initialViewState}
        controller={true}
      >
        <Map
          reuseMaps
          mapLib={maplibregl}
          mapStyle={"https://layers-api.planninglabs.nyc/v1/base/style.json"}
        />
      </DeckGL>
    </div>
  );
}

export default App;
