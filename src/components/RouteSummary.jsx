import React from 'react'

function RouteSummary({routeSummary, duration}) {
  return (
	<div className="filter-block">
		{routeSummary && (
          <div className="route-info">
            <strong>Total:</strong> {routeSummary.totalDistance} km /{" "}
            {duration(routeSummary.totalDurationMinutes)}
            <br /><br />
            {routeSummary.legs.map((leg, index) => (
              <div key={index}>
                {index+1}. {leg.from} → {leg.to}: {leg.distance} km /{" "}
                {duration(leg.durationMinutes)}
				<br /><br />
              </div>
            ))}
          </div>
        )}
	</div>
  )
}

export default RouteSummary