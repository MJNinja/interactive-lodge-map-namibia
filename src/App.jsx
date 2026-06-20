import React, { useEffect, useState } from "react";
import "./App.css";
import AirportSelector from "./components/AirportSelector";
import FeatureFilter from "./components/FeatureFilter";
import LodgeFilter from "./components/LodgeFilter";
import RouteSummary from "./components/RouteSummary";
import RouteSelector from "./components/RouteSelector";
import MapComponent from "./components/MapComponent";
import RouteCalculator from "./components/RouteCalculator";

function App() {
	/**
	 * Airports
	 */
	const airports = [
		{
			id: 1,
			name: "Hosea Kutako International Airport",
			lat: -22.48700603930932,
			lng: 17.463472253233,
		},
		{
			id: 2,
			name: "Walvis Bay International Airport",
			lat: -22.977172601947817,
			lng: 14.641379679274463,
		},
		{
			id: 3,
			name: "Eros Airport",
			lat: -22.505076135862247,
			lng: 17.08307520291606,
		},
	];

	/**
	 * Lodges
	 */
	const lodgesData = [
		{
			id: 1,
			name: "Etosha Safari Lodge",
			lat: -19.402804788094652,
			lng: 15.912696037440181,
			features: ["Wildlife", "Pool"],
			image: "/images/lodges/caprivi-river-lodge.jpg",
			iconUrl: "/icons/lodge.png",
		},
		{
			id: 2,
			name: "Caprivi River Lodge",
			lat: -17.49097352453292,
			lng: 24.31580452529054,
			features: ["River", "Fishing"],
			image: "/images/lodges/etosha-safari-lodge.jpg",
			iconUrl: "/icons/lodge.png",
		},
		{
			id: 3,
			name: "Sossusvlei Desert Lodge",
			lat: -24.77936063981155,
			lng: 15.888628183156543,
			features: ["Desert", "Stargazing"],
			image: "/images/lodges/sossusvlei-desert-lodge.jpg",
			iconUrl: "/icons/lodge.png",
		},
		{
			id: 4,
			name: "Waterberg Plateau Lodge",
			lat: -20.483655492085827,
			lng: 17.29944202592291,
			features: ["Hiking", "Wildlife"],
			image: "/images/lodges/waterberg-plateau-lodge.jpg",
			iconUrl: "/icons/lodge.png",
		},
	];

	const allFeatures = [
		"Wildlife",
		"Pool",
		"River",
		"Fishing",
		"Desert",
		"Stargazing",
		"Hiking",
	];

	/**
	 * Handle State
	 */
	const [routePreference, setRoutePreference] = useState("fastest"); /* "fastest" or "shortest" */
	const [selectedAirport, setSelectedAirport] = useState(airports[0]);
	const [selectedFeatures, setSelectedFeatures] = useState([]);
	const [hiddenLodges, setHiddenLodges] = useState([]);
	const [isSidebarVisible, setIsSidebarVisible] = useState(true);
	const [mapInstance, setMapInstance] = useState(null);
	const [routeLayer, setRouteLayer] = useState(null);
	const [routeSummary, setRouteSummary] = useState(null);
	const [appLoading, setAppLoading] = useState(false);

	/**
	 * Handles selecting a new starting airport, updating global state.
	 */
	const handleAirportChange = (newAirportId) => {
		setSelectedAirport(airports.find((currentAirport) => currentAirport.id === newAirportId));
	};

	/**
	 * Handles changing the route calculation strategy (fastest vs shortest).
	 */
	const handleRouteChange = (preference) => {
		setRoutePreference(preference);
	};

	/**
	 * Toggles a lodge's visibility state on or off.
	 */
	const handleToggleLodge = (lodgeId) => {
		setHiddenLodges(prevHiddenLodges => {
			if (prevHiddenLodges.includes(Number(lodgeId))) {
				// If it's already hidden, unhide it (remove ID from array)
				return prevHiddenLodges.filter((selectedLodge) => selectedLodge !== Number(lodgeId));
			} else {
				// If it's visible, hide it (add ID to array)
				return [...prevHiddenLodges, Number(lodgeId)];
			}
		});
	};

	/**
	 * Toggles a specific feature state on or off.
	 */
	const handleToggleFeature = (feature) => {
		setSelectedFeatures(prevSelectedFeatures => {
			if (prevSelectedFeatures.includes(feature)) {
				// If it's already selected, remove it
				return prevSelectedFeatures.filter((selectedFeature) => selectedFeature !== feature);
			} else {
				// If it's not selected, add it
				return [...prevSelectedFeatures, feature];
			}
		});
	};

	/**
	 * Format minutes → readable time
	 */
	const formatDuration = (minutes) => {
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return hours === 0
			? `${remainingMinutes} min`
			: `${hours}h ${remainingMinutes} min`;
	};

	/**
	 * Filter Lodges
	 */
	const visibleLodges = lodgesData.filter((lodge) => {
		const isHidden = hiddenLodges.includes(lodge.id);

		const matchesFeatures =
			selectedFeatures.length === 0 ||
			selectedFeatures.every((feature) =>
			lodge.features.includes(feature)
			);

		return !isHidden && matchesFeatures;
	});

	return (
		<div className={`app-container ${appLoading ? 'app-loading' : ''}`}>
			<button
				className={`hamburger-btn ${isSidebarVisible ? "" : "active"}`}
				onClick={() => setIsSidebarVisible(!isSidebarVisible)}
				>
				☰
			</button>

			<div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
				<AirportSelector 
					airports={airports} 
					selectedId={selectedAirport.id} 
					onSelectAirport={handleAirportChange} 
				/>

				{/* NEW: Route preference toggle */}
				<RouteSelector
					currentPreference={routePreference}
					onSelectPreference={handleRouteChange}
				/>

				<LodgeFilter 
					lodges={lodgesData} 
					hiddenLodges={hiddenLodges} 
					onToggleLodge={handleToggleLodge}
				/>

				<FeatureFilter
					features={allFeatures} 
					selectedFeatures={selectedFeatures} 
					onToggleFeature={handleToggleFeature}
				/>

				<RouteCalculator
					mapInstance={mapInstance}
					routeLayer={routeLayer}
					selectedAirport={selectedAirport}
					visibleLodges={visibleLodges}
					routePreference={routePreference}
					setRouteSummary={setRouteSummary}
					setRouteLayer={setRouteLayer}
					setAppLoading={setAppLoading}
				/>

				<RouteSummary
					routeSummary={routeSummary}
					duration={formatDuration}
				/>
			</div>

			<MapComponent
				mapInstance={mapInstance}
				selectedAirport={selectedAirport}
				visibleLodges={visibleLodges}
				setMapInstance={setMapInstance}
			/>
		</div>
	);
}

export default App;