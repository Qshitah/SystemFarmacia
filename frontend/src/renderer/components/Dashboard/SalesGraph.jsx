import Chart from 'chart.js/auto';
import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import GraphChart from './GraphChart';
import CircleChart from './CircleChart';

export default function SalesGraph() {

    return (
        <React.Fragment>

            <div className="row">
                <GraphChart/>

                <CircleChart/>
                
            </div>
        </React.Fragment>
    )
}
