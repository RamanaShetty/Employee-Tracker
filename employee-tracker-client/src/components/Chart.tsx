import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js/auto";
import { Pie } from "react-chartjs-2"

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
)



const Chart: React.FC<{labels: string[], data: number[]}> = ({labels, data}:{labels: string[], data: number[]})=> {
    return (
        <Pie 
            data={{
                labels: labels,
                datasets: [
                    {
                        data: data,
                    },
                ]
            }}
            options={{
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,
                            },
                        },
                    },
                },
            }}
            style={{ width: '400px', height: '400px' }}
        />
    )
}

export default Chart;