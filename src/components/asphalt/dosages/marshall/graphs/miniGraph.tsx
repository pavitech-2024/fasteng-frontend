import CardMiniGrafico from "@/components/atoms/containers/miniGraphCard";
import { Chart } from "react-google-charts";

const MiniGraphics = ({ data, type, nameEixoY }) => {
  return (
    <CardMiniGrafico>
      <Chart
        chartType="LineChart"
        data={data}
        options={{
          title: `Teor de ligante asfáltico X ${type} `,
          curveType: "function",
          hAxis: {
            title: "Teor de ligante asfáltico (%)",
            titleTextStyle: { italic: false }
          },
          chartArea: { width: "70%", height: "70%" },
          vAxis: {
            title: nameEixoY,
            titleTextStyle: { italic: false }
          },
          legend: "none"
        }}
        width="100%"
        height="100%"
      />
    </CardMiniGrafico>
  );
};

export default MiniGraphics;
