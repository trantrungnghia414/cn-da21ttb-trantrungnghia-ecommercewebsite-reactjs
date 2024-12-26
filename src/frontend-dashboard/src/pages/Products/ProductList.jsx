import { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { axiosAppJson } from '~/config/axios.config';

function ProductList() {

  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const response = await axiosAppJson.get('/products');
    setProducts(response.data);
  }

  useEffect(() => {
    fetchProducts();
  }
  , []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return;
    await axiosAppJson.delete(`/products/${id}`);
    fetchProducts();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Sản phẩm</h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách tất cả sản phẩm trong cửa hàng
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/products/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Tên sản phẩm
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Danh mục
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Thương hiệu
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Màu sắc
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Giá & Dung lượng
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Trạng thái
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product) => (
                    <tr key={product.ProductID}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {product.Name}
                        </div>
                        <div className="text-gray-500">{product.Description}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.category.Name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {product.brand.Name}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col space-y-2">
                          {product.colors.map((color, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 rounded-full border border-gray-200" 
                                style={{ backgroundColor: color.ColorCode }}
                                title={color.ColorName}
                              />
                              <span>{color.ColorName}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          {product.variants.map((variant, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="font-medium">{variant.MemorySize}:</span>
                              <span>
                                {new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND'
                                }).format(variant.Price)}
                              </span>
                              <span className="text-gray-400">
                                (Còn {variant.Stock})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            product.variants.some(v => v.Stock > 0)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.variants.some(v => v.Stock > 0) ? 'Còn hàng' : 'Hết hàng'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/admin/products/edit/${product.ProductID}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(product.ProductID)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
