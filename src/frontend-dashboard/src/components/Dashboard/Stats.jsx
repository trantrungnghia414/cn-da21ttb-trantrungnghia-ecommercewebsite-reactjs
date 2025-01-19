import { useState, useEffect } from "react";
import {
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    CubeIcon,
} from "@heroicons/react/24/outline";
import { axiosAppJson } from "~/config/axios.config";

function Stats() {
    const [statsData, setStatsData] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
        revenueChange: 0,
        ordersChange: 0,
        customersChange: 0,
        productsChange: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosAppJson.get("/api/stats");
                setStatsData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stats:", error);
                setError("Không thể tải dữ liệu thống kê");
                setLoading(false);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
                    >
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                            {error}
                        </h3>
                    </div>
                </div>
            </div>
        );
    }

    const stats = [
        {
            id: 1,
            name: "Tổng doanh thu",
            value: new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(statsData.totalRevenue || 0),
            icon: CurrencyDollarIcon,
            change: `${statsData.revenueChange || 0}%`,
            changeType:
                (statsData.revenueChange || 0) >= 0 ? "increase" : "decrease",
        },
        {
            id: 2,
            name: "Đơn hàng",
            value: statsData.totalOrders || 0,
            icon: ShoppingCartIcon,
            change: `${statsData.ordersChange}%`,
            changeType: statsData.ordersChange >= 0 ? "increase" : "decrease",
        },
        {
            id: 3,
            name: "Khách hàng",
            value: statsData.totalCustomers || 0,
            icon: UserGroupIcon,
            change: `${statsData.customersChange}%`,
            changeType:
                statsData.customersChange >= 0 ? "increase" : "decrease",
        },
        {
            id: 4,
            name: "Sản phẩm",
            value: statsData.totalProducts || 0,
            icon: CubeIcon,
            change: `${statsData.productsChange}%`,
            changeType: statsData.productsChange >= 0 ? "increase" : "decrease",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
                <div
                    key={item.id}
                    className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
                >
                    <dt>
                        <div className="absolute rounded-md bg-blue-500 p-3">
                            <item.icon
                                className="h-6 w-6 text-white"
                                aria-hidden="true"
                            />
                        </div>
                        <p className="ml-16 truncate text-sm font-medium text-gray-500">
                            {item.name}
                        </p>
                    </dt>
                    <dd className="ml-16 flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">
                            {item.value}
                        </p>
                        <p
                            className={`ml-2 flex items-baseline text-sm font-semibold ${
                                item.changeType === "increase"
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {item.change}
                        </p>
                    </dd>
                </div>
            ))}
        </div>
    );
}

export default Stats;
