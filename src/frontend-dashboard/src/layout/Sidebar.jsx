import { Link, useLocation } from "react-router-dom";
import {
    HomeIcon,
    CubeIcon,
    TagIcon,
    ShoppingCartIcon,
    UsersIcon,
    ShoppingBagIcon,
    TruckIcon,
    GiftIcon,
} from "@heroicons/react/24/outline";
import logo from "~/assets/images/logo.png";

function Sidebar() {
    const location = useLocation();

    const navigation = [
        { name: "Dashboard", href: "/admin", icon: HomeIcon },
        { name: "Sản phẩm", href: "/admin/products", icon: CubeIcon },
        { name: "Danh mục", href: "/admin/categories", icon: TagIcon },
        { name: "Kích thước", href: "/admin/memorysizes", icon: CubeIcon },
        { name: "Thương hiệu", href: "/admin/brands", icon: ShoppingBagIcon },
        { name: "Nhà cung cấp", href: "/admin/suppliers", icon: TruckIcon },
        { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCartIcon },
        { name: "Khách hàng", href: "/admin/users", icon: UsersIcon },
        { name: "Khuyến mãi", href: "/admin/promotions", icon: GiftIcon },
    ];

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1 bg-gray-800">
                    {/* Logo */}
                    <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
                        <Link to="/admin" className="flex items-center">
                            <img className="h-8 w-auto" src={logo} alt="Logo" />
                            <span className="ml-2 text-white text-lg font-semibold">
                                NGHIASTORE
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <nav className="flex-1 px-2 py-4 space-y-1">
                            {navigation.map((item) => {
                                const isActive =
                                    location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${
                          isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                    `}
                                    >
                                        <item.icon
                                            className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${
                            isActive
                                ? "text-white"
                                : "text-gray-400 group-hover:text-gray-300"
                        }
                      `}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
