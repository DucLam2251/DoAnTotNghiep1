import {
  DatePicker,
  DatePickerProps,
  Descriptions,
  Select,
  Typography,
} from "antd";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppDispatch, RootState } from "../../../../redux";
import {
  getChartPatmentAsync,
  setFilterChartPayment,
} from "../../../../redux/reducers/chartReducer";
import { Utils } from "../../../../utils";
import {
  dateFormat,
  onRenderValue,
  optionFilterChart,
  renderShimmer,
} from "../ultis";
import { PromiseStatus } from "../../../model/enum/common";
import dayjs from "dayjs";

function ChartPayment() {
  const dispatch = useDispatch<AppDispatch>();
  const { chartPayment } = useSelector((state: RootState) => state.chart);
  const { data, status, filterInfo } = chartPayment;
  const { date, order } = filterInfo;

  useEffect(() => {
    dispatch(getChartPatmentAsync(filterInfo));
  }, [dispatch, filterInfo]);

  const renderChartPayment = useCallback(
    () => (
      <div className="chart-datn">
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{
              top: 15,
              right: 30,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} tickLine={false} />
            <Bar
              dataKey="count"
              fill="#8884d8"
              background={{ fill: "#eee" }}
              barSize={20}
            />
            <Tooltip />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ),
    [data]
  );

  const getTotalPayment = () => {
    let res = 0;
    data.forEach((item) => (res += Number(item.count)));
    return res;
  };

  const handleChangeType = (value: string) => {
    dispatch(
      setFilterChartPayment({
        order: value,
        date: date,
      })
    );
  };

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    dispatch(
      setFilterChartPayment({
        order: order,
        date: date,
      })
    );
  };

  return (
    <div>
      <Typography.Paragraph className="title-chart">
        Tổng tiền
      </Typography.Paragraph>
      <div className="filter-chart">
        <div className="dropdown-chart">
          <p>Chọn theo: </p>
          <Select
            value={onRenderValue(order)}
            style={{ width: 150 }}
            onChange={handleChangeType}
            options={optionFilterChart}
          />
        </div>
        <div className="dropdown-chart">
          <p>Thời gian: </p>
          <DatePicker
            defaultValue={dayjs()}
            format={dateFormat}
            style={{ width: 150 }}
            onChange={onChangeDate}
          />
        </div>
      </div>
      {status === PromiseStatus.Loading
        ? renderShimmer()
        : renderChartPayment()}
      <Descriptions
        title={`Tổng thu nhập: ${Utils.formatCurrency(getTotalPayment())} VND`}
        bordered
        style={{ width: "100%", margin: "20px 0" }}
        column={2}
      />
    </div>
  );
}

export default ChartPayment;
