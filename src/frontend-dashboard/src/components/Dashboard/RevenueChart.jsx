import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { axiosAppJson } from "~/config/axios.config";

function RevenueChart() {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const response = await axiosAppJson.get("/api/stats/revenue");
                setRevenueData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
                setLoading(false);
            }
        };

        fetchRevenueData();
    }, []);

    if (loading) {
        return (
            <div className="h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-gray-500">
                    Đang tải dữ liệu...
                </div>
            </div>
        );
    }

    return (
        <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={revenueData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(value) => `T${value}`}
                    />
                    <YAxis
                        tickFormatter={(value) => {
                            if (value >= 1000000000) {
                                return `${(value / 1000000000).toFixed(1)} tỷ`;
                            }
                            if (value >= 1000000) {
                                return `${(value / 1000000).toFixed(1)} tr`;
                            }
                            return `${(value / 1000).toFixed(0)} đ`;
                        }}
                    />
                    <Tooltip
                        formatter={(value) => {
                            return (
                                new Intl.NumberFormat("vi-VN", {
                                    style: "decimal",
                                    maximumFractionDigits: 0,
                                }).format(value) + " đ"
                            );
                        }}
                        labelFormatter={(label) => `Tháng ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default RevenueChart;
