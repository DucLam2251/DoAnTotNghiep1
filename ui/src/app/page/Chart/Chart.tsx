import './Chart.scss'
import { ChartNumberAppointment, ChartNumberDepartment, ChartPayment } from './components'

function Chart() {
  return (
    <div className='w-chart'>
        <div className='chart'>
            <ChartPayment />
            <ChartNumberDepartment />
            <ChartNumberAppointment />
        </div>
    </div>
  )
}

export default Chart