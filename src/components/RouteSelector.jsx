import React from 'react'

function RouteSelector({ currentPreference, onSelectPreference }) {
  return (
	<div className="filter-block">
		<h3>Route Type</h3>
        <label className="checkbox">
          <input
            type="radio"
            value="fastest"
            checked={currentPreference === "fastest"}
            onChange={(e) => onSelectPreference(e.target.value)}
          />
          Fastest (default)
        </label>

        <label className="checkbox">
          <input
            type="radio"
            value="shortest"
            checked={currentPreference === "shortest"}
            onChange={(e) => onSelectPreference(e.target.value)}
          />
          Shortest distance
        </label>
	</div>
  )
}

export default RouteSelector