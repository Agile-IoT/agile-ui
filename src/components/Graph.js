import { Card } from 'material-ui/Card';
import React from 'react';

function Graph(props) {
  tempDrawGraph(props.graphs, props.id, props.fieldName, props.data)

  return (
    <div className='graph'>
      <div
        id={`graphdiv${props.id}`}
        style={{
          "width": "100%",
          "height": "100%"
        }}
        >
        </div>
    </div>
  )
}

const tempDrawGraph = (graphs, id, fieldName, data) => {
  if (!document.getElementById(`graphdiv${id}`))
    return

  var g = new window.Dygraph(
    document.getElementById(`graphdiv${id}`),
    getCSVForField(fieldName, data),
    {
      'title': ' ',
      'legend': 'always',
      'fillGraph': true,
      'strokeWidth': 1.5,
      'color': '#00BCD4'
    }
  );

  window.graphs.push(g)
}

const getCSVForField = (fieldName) => {
  var CSV = `Date, ${fieldName}`
  const data = `[{"time":"2017-08-08T18:56:57.073Z","componentID":"Humidity","deviceID":"ble247189E6E280","format":"","lastUpdate":1502229387301,"unit":"Relative humidity (%RH)","value":"41.97998"},{"time":"2017-08-08T19:56:57.073Z","componentID":"Humidity","deviceID":"ble247189E6E280","format":"","lastUpdate":1502222217073,"unit":"Relative humidity (%RH)","value":"43.97998"},{"time":"2017-08-08T20:56:57.073Z","componentID":"Humidity","deviceID":"ble247189E6E280","format":"","lastUpdate":1502225817073,"unit":"Relative humidity (%RH)","value":"49.97998"},{"time":"2017-08-08T21:56:57.073Z","componentID":"Humidity","deviceID":"ble247189E6E280","format":"","lastUpdate":1502229417073,"unit":"Relative humidity (%RH)","value":"52.97998"},{"time":"2017-08-08T22:56:57.073Z","componentID":"Humidity","deviceID":"ble247189E6E280","format":"","lastUpdate":1502233017073,"unit":"Relative humidity (%RH)","value":"41.97998"},{"time":"2017-08-08T23:56:57.073Z","componentID":"Humidity","deviceID":"ble247189E6E280","format":"","lastUpdate":1502236617073,"unit":"Relative humidity (%RH)","value":"41.97998"}]`

  JSON.parse(data).forEach(r => {
      CSV += `,\n${new Date(r.lastUpdate)}, ${r.value}`
  })
  return CSV
}

export default Graph
