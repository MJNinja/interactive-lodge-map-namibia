import React from 'react'

function LodgeFilter({lodges, hiddenLodges, onToggleLodge}) {
  return (
	<div className="filter-block">
		<h3>Lodges</h3>
        {lodges.map((lodge) => (
          <label key={lodge.id} className="checkbox">
            <input
              type="checkbox"
              checked={!hiddenLodges.includes(lodge.id)}
              onChange={() => onToggleLodge(lodge.id)}
            />
            {lodge.name}
          </label>
        ))}
	</div>
  )
}

export default LodgeFilter