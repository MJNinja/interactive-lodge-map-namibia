import React, { useCallback } from 'react';
import Leaflet from "leaflet";

function RouteCalculator({ 
    mapInstance,			// The Leaflet instance to draw on
	routeLayer,				// The geoJSON layer for the route
    selectedAirport,		// Starting point data
    visibleLodges,			// Lodges to visit
    routePreference,		// Fastest or shortest preference
    setRouteSummary,		// Route info summary
    setRouteLayer,			// Drawn geoJSON layer
	setAppLoading			// Handles the loading state
}) {

	// Use useCallback because this function relies on props and should only be recreated 
    const calculateRoute = useCallback(async () => {
        if (!mapInstance || visibleLodges.length < 1) return;

        const airportCoordinates = [
            selectedAirport.lng,
            selectedAirport.lat,
        ];

        try {
            // --- STEP 1: OPTIMIZATION API ---
            const jobs = visibleLodges.map((lodge, index) => ({
                id: index + 1,
                location: [lodge.lng, lodge.lat],
            }));

            const optimizationResponse = await fetch(
                "https://api.openrouteservice.org/optimization",
                {
                    method: "POST",
                    headers: {
                        Authorization: import.meta.env.VITE_ORS_API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        jobs,
                        vehicles: [
                            {
                                id: 1,
                                profile: "driving-car",
                                start: airportCoordinates,
                                end: airportCoordinates,
                            },
                        ],
                        options: {
                            weighting: routePreference === "shortest" ? "shortest" : "fastest",
                        },
                    }),
                }
            );

            const optimizationData = await optimizationResponse.json();

            const orderedJobs = optimizationData.routes[0].steps.filter(
                (step) => step.type === "job"
            );

            const optimizedLodges = orderedJobs.map(
                (step) => visibleLodges[step.job - 1]
            );

            // --- STEP 2: DIRECTIONS API ---
			const finalCoordinates = [
				airportCoordinates,
				...optimizedLodges.map((lodge) => [lodge.lng, lodge.lat]),
				airportCoordinates,
			];

            const directionsResponse = await fetch(
                "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
                {
                    method: "POST",
                    headers: {
                        Authorization: import.meta.env.VITE_ORS_API_KEY,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        coordinates: finalCoordinates,
                        radiuses: Array(finalCoordinates.length).fill(1000), // 1km search
                        preference: routePreference,
                    }),
                }
            );

            const data = await directionsResponse.json();

            // Update the map and summary state in the parent component (App.jsx)
			let newLayer = null;
            if (mapInstance) {
                 // Use a direct callback to interact with the physical map object
                if (routeLayer) mapInstance.removeLayer(routeLayer);

                newLayer = Leaflet.geoJSON(data, {
                    style: {
                        color: routePreference === "shortest" ? "green" : "blue",
                        weight: 5,
                        opacity: 0.9,
                        dashArray: routePreference === "shortest" ? "6, 6" : null,
                    },
                }).addTo(mapInstance);

                // Call the setter function passed from App.jsx
                setRouteLayer(newLayer); 
            }

            const summary = data.features[0].properties.summary;
            const segments = data.features[0].properties.segments;

			const legs = segments.map((segment, index) => ({
				from:
					index === 0
						? selectedAirport.name
						: optimizedLodges[index - 1]?.name || selectedAirport.name,

				to:
					optimizedLodges[index]?.name || selectedAirport.name,

				distance: (segment.distance / 1000).toFixed(2),
				durationMinutes: Math.round(segment.duration / 60),
			}));

            // Call the setter for summary in App.jsx
            setRouteSummary({
                totalDistance: (summary.distance / 1000).toFixed(2),
                totalDurationMinutes: Math.round(summary.duration / 60),
                legs,
            });

            if (mapInstance && newLayer) {
				mapInstance.fitBounds(newLayer.getBounds());
			}

        } catch (error) {
			setAppLoading(false);
            console.error("Error calculating route:", error);
        } finally{
			setAppLoading(false); 
		}
    }, [mapInstance, routeLayer, visibleLodges, selectedAirport, routePreference, setRouteSummary, setRouteLayer, setAppLoading]);


    // We wrap the entire logic in a button click handler and trigger it with a click.
    const handleClick = () => {
		setAppLoading(true);
        calculateRoute();
    };

    return (
        <button onClick={handleClick} className="calculate-route-button">
            Calculate Route
        </button>
    );
};

export default RouteCalculator;