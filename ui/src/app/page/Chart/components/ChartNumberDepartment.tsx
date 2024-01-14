import { DatePicker, DatePickerProps, Descriptions, Select, Typography } from "antd";
import dayjs from "dayjs";
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
  getChartTotalAppAsync,
  setFilterChartDepartment,
} from "../../../../redux/reducers/chartReducer";
import { PromiseStatus } from "../../../model/enum/common";
import {
  dateFormat,
  onRenderValue,
  optionFilterChart,
  renderShimmer,
} from "../ultis";
import { Utils } from "../../../../utils";

function ChartNumberDepartment() {
  const dispatch = useDispatch<AppDispatch>();
  const { chartNumberDepartment } = useSelector(
    (state: RootState) => state.chart
  );
  const { data, status, filterInfo } = chartNumberDepartment;
  const { date, order } = filterInfo;

  useEffect(() => {
    dispatch(getChartTotalAppAsync(filterInfo));
  }, [dispatch, filterInfo]);

  const renderChartNumberAppointment = useCallback(
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

  const handleChangeType = (value: string) => {
    dispatch(
      setFilterChartDepartment({
        order: value,
        date: date,
      })
    );
  };

  const onChangeDate: DatePickerProps["onChange"] = (date) => {
    dispatch(
      setFilterChartDepartment({
        order: order,
        date: date,
      })
    );
  };
  const getTotalPayment = () => {
    let res = 0;
    data.forEach((item) => (res += Number(item.count)));
    return res;
  };
  return (
    <div>
      <Typography.Paragraph className="title-chart">
        Số lượng người khám
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
        : renderChartNumberAppointment()}
           <Descriptions
        title={`Tổng khám: ${Utils.formatCurrency(getTotalPayment())}`}
        bordered
        style={{ width: "100%", margin: "20px 0" }}
        column={2}
      />
    </div>
  );
}

export default ChartNumberDepartment;
