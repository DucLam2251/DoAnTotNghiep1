import { Shimmer, Stack } from "@fluentui/react";
import { OrderChart } from "../../model/enum/common";

export const optionFilterChart = [
  {
    label: "Ngày",
    value: OrderChart.Day,
  },
  {
    label: "Tháng",
    value: OrderChart.Month,
  },
  {
    label: "Quý",
    value: OrderChart.Quarter,
  },
  {
    label: "Năm",
    value: OrderChart.Year,
  },
];

export const onRenderValue = (type: number) => {
  switch (type) {
    case OrderChart.Day:
      return "Ngày";
    case OrderChart.Month:
      return "Tháng";
    case OrderChart.Quarter:
      return "Quý";
    case OrderChart.Year:
      return "Năm";
    default:
      return " ";
  }
};

export const renderShimmer = () => {
  return (
    <Stack tokens={{ childrenGap: 24 }} style={{ height: 300, marginTop: "20px" }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Stack.Item
          key={index.toLocaleString()}
          styles={{ root: { opacity: 1 - 0.1 * index } }}
        >
          <Shimmer styles={{ shimmerWrapper: { height: 24 } }} />
        </Stack.Item>
      ))}
    </Stack>
  );
};


export const dateFormat = "DD/MM/YYYY"