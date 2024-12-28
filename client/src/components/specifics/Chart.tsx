import { Bar, Line } from "react-chartjs-2";
import {
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Chart as ChartJS,
} from "chart.js";
import { getLast7Days, getNext7Days } from "@/lib/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement
);

const labelsLast = getLast7Days();
const labelsNext = getNext7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
      },
    },
  },
};

const LineChart = ({ value }: any) => {
  const data = {
    labels: labelsLast,
    datasets: [
      {
        data: value,
        label: "Meetings",
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,0.3)",
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const barChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: true,
      },
    },
  },
};

const BarChart = ({ value }: any) => {
  const data = {
    labels: labelsNext,
    datasets: [
      {
        data: value,
        label: "Meetings",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,0.3)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} options={barChartOptions} />;
};

export { LineChart, BarChart };
