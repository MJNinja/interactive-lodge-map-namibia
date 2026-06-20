# Interactive Lodge Map Namibia

An interactive tourism and route-planning application for Namibia built with React, Vite, and Leaflet.

The application allows users to explore lodges across Namibia, filter lodges by features, select a starting airport, and calculate optimized travel routes using the OpenRouteService API.

## Features

* Interactive map powered by Leaflet and OpenStreetMap
* Multiple airport starting points
* Lodge visibility controls
* Feature-based lodge filtering
* Route optimization using OpenRouteService
* Fastest or shortest route calculation
* Detailed route summary with distance and travel time
* Responsive sidebar and map layout

## Demo Functionality

Users can:

1. Select a starting airport
2. Filter lodges by available features
3. Show or hide specific lodges
4. Choose between:

   * Fastest route
   * Shortest route
5. Generate an optimized travel itinerary
6. View route details directly on the map

## Tech Stack

* React 19
* Vite
* Leaflet
* OpenStreetMap
* OpenRouteService API
* JavaScript (ES Modules)

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/interactive-lodge-map-namibia.git
cd interactive-lodge-map-namibia
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ORS_API_KEY=your_openrouteservice_api_key
```

You can obtain a free API key from:
https://openrouteservice.org

## Running the Application

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Route Optimization

The application uses OpenRouteService for:

* Vehicle route optimization
* Multi-stop trip planning
* Driving directions
* Distance calculations
* Travel time estimation

Generated routes begin and end at the selected airport while visiting all visible lodges in the most efficient order.

## Map Data

The map uses:

* OpenStreetMap tiles
* Custom airport markers
* Custom lodge markers
* Dynamic route overlays

## License

This project is licensed under the MIT License.
