import React from 'react'

function AirportSelector({airports, selectedId, onSelectAirport}) {
  return (
	<div className="filter-block">
		<h3>Airport</h3>
		<select
			value={selectedId}
			onChange={(e) =>
				onSelectAirport(Number(e.target.value))
			}
		>
			{airports.map((airport) => (
				<option key={airport.id} value={airport.id}>
					{airport.name}
				</option>
			))}
		</select>
	</div>
  )
}

export default AirportSelector