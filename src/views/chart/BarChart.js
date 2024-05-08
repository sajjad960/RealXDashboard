import React from "react";
import { Card, CardHeader, CardTitle, CardBody } from "reactstrap";
import { Bar } from "react-chartjs-2";

const $primary = "#7367F0",
  $success = "#28C76F",
  $danger = "#EA5455",
  $warning = "#FF9F43",
  $label_color = "#1E1E1E",
  grid_line_color = "#dae1e7";

// const data = {
//   labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
//   datasets: [
//     {
//       label: "Population (millions)",
//       data: [50, 100, 40, 90, 30],
//       backgroundColor: themeColors,
//       borderColor: "transparent"
//     }
//   ]
// }

const options = {
  elements: {
    rectangle: {
      borderWidth: 2,
      borderSkipped: "left",
    },
  },
  responsive: true,
  responsiveAnimationDuration: 500,

  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: grid_line_color,
        },
        scaleLabel: {
          display: true,
        },
      },
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          color: grid_line_color,
        },
        scaleLabel: {
          display: true,
        },
        ticks: {
          stepSize: 20,
        },
      },
    ],
  },
  maintainAspectRatio: false,
  title: {
    display: true,
    text: "",
  },
  legend: { display: false },
};

class BarCharts extends React.Component {
  render() {
    const themeColors = [$primary, $success, $danger, $warning, $label_color];

    const data = {
      labels: [],
      datasets: [
        {
          label: "Views",
          data: [],
          backgroundColor: themeColors, // Add your colors here
          borderColor: "transparent",
        },
      ],
    };
    const propsDataProduct = this?.props?.topProducts
    if(propsDataProduct) {
      propsDataProduct.forEach(item => {
        data.labels.push(item?.product_log_details?.name)
        data.datasets[0].data.push(item?.product_views);
      });
    }
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Products</CardTitle>
        </CardHeader>
        <CardBody>
          <Bar data={data} options={options} height={400} />
        </CardBody>
      </Card>
    );
  }
}
export default BarCharts;
