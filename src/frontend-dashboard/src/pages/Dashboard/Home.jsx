import RecentOrders from "~/components/Dashboard/RecentOrders";
import RevenueChart from "~/components/Dashboard/RevenueChart";
import Stats from "~/components/Dashboard/Stats";


function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Thống kê tổng quan */}
      <Stats />
      
      {/* Biểu đồ doanh thu */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Doanh thu theo tháng</h2>
        <RevenueChart />
      </div>
      
      {/* Đơn hàng gần đây */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Đơn hàng gần đây</h2>
        <RecentOrders />
      </div>
    </div>
  );
}

export default Home;
