import React from 'react'

function FeatureFilter({features, selectedFeatures, onToggleFeature}) {
  return (
	<div className="filter-block">
		<h3>Features</h3>
        {features.map((feature) => (
          <label key={feature} className="checkbox">
            <input
              type="checkbox"
              checked={selectedFeatures.includes(feature)}
              onChange={() => onToggleFeature(feature)}
            />
            {feature}
          </label>
        ))}
	</div>
  )
}

export default FeatureFilter