import React, { useEffect } from "react";
import Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * FIX: Leaflet marker icons
 */
delete Leaflet.Icon.Default.prototype._getIconUrl;
Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapComponent({mapInstance, selectedAirport, visibleLodges, setMapInstance}) {

	/**
     * Hook that runs ONCE when the component mounts.
     * Sets up the base map layer and tiles.
     */
	useEffect(() => {
		// Initialize the map object
		const leafletMap = Leaflet.map("map", {
			center: [-22.0, 17.0],
			zoom: 6,
			zoomControl: false,
		});

		Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap",
		}).addTo(leafletMap);

		// Add standard zoom control
		Leaflet.control.zoom({ position: "topright" }).addTo(leafletMap);

		setMapInstance(leafletMap);
		
		setTimeout(() => leafletMap.invalidateSize(), 0);

		return () => leafletMap.remove();
	}, [setMapInstance]);

	/**
     * Hook that handles marker drawing and redrawing.
     */
	useEffect(() => {
		// Guard clause: Don't run if the map hasn't been initialized yet.
		if (!mapInstance) return;

		// Cleanup existing markers every time dependencies change
		mapInstance.eachLayer((layer) => {
			if (layer instanceof Leaflet.Marker) {
				mapInstance.removeLayer(layer);
			}
		});

		// Airport marker
		const airportIcon = Leaflet.icon({
			iconUrl: "/icons/airport.png",
			iconSize: [32, 42],
			iconAnchor: [16, 42],
		});

		Leaflet.marker([selectedAirport.lat, selectedAirport.lng], { icon: airportIcon })
			.addTo(mapInstance)
			.bindPopup(`<strong>${selectedAirport.name}</strong><br/>Starting Point`);

		// Lodge markers
		visibleLodges.forEach((lodge) => {
			const icon = lodge.iconUrl
			? Leaflet.icon({
					iconUrl: lodge.iconUrl,
					iconSize: [32, 43],
					iconAnchor: [16, 43],
				})
			: new Leaflet.Icon.Default();

			Leaflet.marker([lodge.lat, lodge.lng], { icon })
			.addTo(mapInstance)
			.bindPopup(`
				<div style="width:200px">
					<img src="${lodge.image}" style="width:100%; height:120px; object-fit:cover;" />
					<strong>${lodge.name}</strong><br/>
					${lodge.features.join(", ")}
				</div>
			`);
		});
	}, [mapInstance, visibleLodges, selectedAirport]);
	
	return <div id="map"></div>; 
}

export default MapComponent