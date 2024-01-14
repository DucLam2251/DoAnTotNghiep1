import { DatePicker, DatePickerProps, Select, Typography } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppDispatch, RootState } from "../../../../redux";
import {
  getChartTotalAppointmentAsync,
  setFilterChartAppointment,
} from "../../../../redux/reducers/chartReducer";
import { convertDate } from "../../../../utils/function";
import { PromiseStatus } from "../../../model/enum/common";
import {
  dateFormat,
  onRenderValue,
  optionFilterChart,
  renderShimmer,
} from "../ultis";
import "../Chart.scss";

function ChartNumberAppointment() {
  const dispatch = useDispatch<AppDispatch>();
  const { chartNumberAppointment } = useSelector(
    (state: RootState) => state.chart
  );
  const { data, status, filterInfo } = chartNumberAppointment;
  const { date, order } = filterInfo;

  console.log("data", data);

  useEffect(() => {
    dispatch(getChartTotalAppointmentAsync(filterInfo));
  }, [dispatch, filterInfo]);

  const dataReal = [
    {
      count: "",
      dateTime: "",
    },
    ...data,
  ];

  const renderChartAppointment = useCallback(
    () => (
      <div className="chart-datn">
        <ResponsiveContainer>
          <LineChart
            data={dataReal}
            layout="horizontal"
            margin={{
              top: 15,
              right: 30,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dateTime"
              tickFormatter={(value: string) => convertDate(value)}
            />
            <YAxis domain={[0, 4]} tickLine={false} />
            <Line dataKey="count" stroke="#4BB199" strokeWidth={3} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    ),
    [data]
  );

  const handleChangeType = (value: string) => {
    dispatch(
      setFilterChartAppointment({
        order: value,
        date: date,
      })
    );
  };

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    dispatch(
      setFilterChartAppointment({
        order: order,
        date: date,
      })
    );
  };

  return (
    <div>
      <Typography.Paragraph className="title-chart">
        Chart Appointment
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
        : renderChartAppointment()}
    </div>
  );
}

export default ChartNumberAppointment;
