import React from 'react'
import Statistics from './Statistics'
import SalesGraph from './SalesGraph'

export default function Dashboard() {
	return (
		<React.Fragment>
			<div className="content" style={{background:'#14141403'}}>
				<Statistics/>
				<SalesGraph/>
				
			</div>
		</React.Fragment>
	)
}
