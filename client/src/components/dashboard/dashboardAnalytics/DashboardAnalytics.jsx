import "./dashboardanalytics.scss";
import { Stack, Typography, Box } from "@mui/material"
import { Bar } from "react-chartjs-2";
import useState from 'react';
import Chart from 'chart.js/auto';

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

export default function DashboardAnalytics({ chartData }) {

    console.log(chartData)

    const data = {
        labels: chartData.map((data) => data.month),
        datasets: [{
            data: chartData.map((data) => data.amount),
            label: "Spending",
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }],
    }

    console.log(data)

    return (
        <Stack >
            <Typography sc={{ fontSize: 14}} color="text-secondary" gutterBottom>Analytics ❯</Typography>
            <div className="chart-container">
                <Bar 
                data={data} 
                options={{ 
                    plugins: {
                        legend: {
                            display: true
                        },
                    },
                    scales: {
                         y: {
                             beginAtZero: true 
                        }
                    }
                    }
                }/>
            </div>
        </Stack>
    );
}
