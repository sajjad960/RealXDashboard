import React from "react"
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap"
import { Bar } from "react-chartjs-2"

const $primary = "#7367F0",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $label_color = "#1E1E1E",
  grid_line_color = "#dae1e7"
const themeColors = [$primary, $success, $danger, $warning, $label_color, $primary, $success]

const data = {
  labels: ["Africa", "Asia", "Europe", "Latin America", "North America", "lsd", "kldkf"],
  datasets: [
    {
      label: "Population (millions)",
      data: [20, 100, 40, 90, 30, 60, 10],
      backgroundColor: themeColors,
      borderColor: "transparent"
    }
  ]
}

const options = {
  elements: {
    rectangle: {
      borderWidth: 2,
      borderSkipped: "left"
    }
  },
  responsive: true,
  responsiveAnimationDuration: 500,

  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: grid_line_color
        },
        scaleLabel: {
          display: true
        }
      }
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          color: grid_line_color
        },
        scaleLabel: {
          display: true
        },
        ticks: {
          stepSize: 20
        }
      }
    ]
  },
  maintainAspectRatio: false,
  title: {
    display: true,
    text: ""
  },
  legend: { display: false }
}

class BarCharts extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 7 Products</CardTitle>
        </CardHeader>
        <CardBody>
          <Bar data={data} options={options} height={400} />
        </CardBody>
      </Card>
    )
  }
}
export default BarCharts
