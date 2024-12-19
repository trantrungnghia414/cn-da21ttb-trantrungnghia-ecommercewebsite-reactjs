import { 
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

function Stats() {
  // Dữ liệu mẫu
  const stats = [
    {
      id: 1,
      name: 'Tổng doanh thu',
      value: '120.500.000đ',
      icon: CurrencyDollarIcon,
      change: '+12%',
      changeType: 'increase'
    },
    {
      id: 2,
      name: 'Đơn hàng',
      value: '156',
      icon: ShoppingCartIcon,
      change: '+8%',
      changeType: 'increase'
    },
    {
      id: 3,
      name: 'Khách hàng',
      value: '2,300',
      icon: UserGroupIcon,
      change: '+15%',
      changeType: 'increase'
    },
    {
      id: 4,
      name: 'Sản phẩm',
      value: '89',
      icon: CubeIcon,
      change: '+3%',
      changeType: 'increase'
    }
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
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
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
