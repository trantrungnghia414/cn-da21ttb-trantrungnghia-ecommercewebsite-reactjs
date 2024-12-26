import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";

function ProductCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: "",
        Slug: "",
        Description: "",
        CategoryID: "",
        BrandID: "",
        variants: [
            {
                MemorySize: "",
                Price: "",
                colors: [
                    {
                        ColorName: "",
                        ColorCode: "",
                        Stock: 0,
                        Images: [],
                    },
                ],
            },
        ],
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    axiosAppJson.get("/categories"),
                    axiosAppJson.get("/brands"),
                ]);
                setCategories(categoriesResponse.data);
                setBrands(brandsResponse.data);
            } catch (error) {
                console.error("Error fetching categories and brands:", error);
            }
        };

        fetchCategoriesAndBrands();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Thêm Slug tự động dựa vào tên sản phẩm
        ...(name === 'Name' ? {
          Slug: value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        } : {})
      }));
      
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    };

    const handleVariantChange = (variantIndex, field, value) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                [field]: value,
            };
            return { ...prev, variants: newVariants };
        });
    };

    const handleColorChange = (variantIndex, colorIndex, field, value) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex].colors[colorIndex] = {
                ...newVariants[variantIndex].colors[colorIndex],
                [field]: value,
            };
            return { ...prev, variants: newVariants };
        });
    };

    const handleImageUpload = (variantIndex, colorIndex, e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex].colors[colorIndex].Images = files.map(
                (file) => ({
                    file,
                    preview: URL.createObjectURL(file),
                })
            );
            return { ...prev, variants: newVariants };
        });
    };

    const removeImage = (variantIndex, colorIndex, imageIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            const newImages = [
                ...newVariants[variantIndex].colors[colorIndex].Images,
            ];
            URL.revokeObjectURL(newImages[imageIndex].preview);
            newImages.splice(imageIndex, 1);
            newVariants[variantIndex].colors[colorIndex].Images = newImages;
            return { ...prev, variants: newVariants };
        });
    };

    const addVariant = () => {
        setFormData((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    MemorySize: "",
                    Price: "",
                    colors: [
                        {
                            ColorName: "",
                            ColorCode: "",
                            Stock: 0,
                            Images: [],
                        },
                    ],
                },
            ],
        }));
    };

    const removeVariant = (variantIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants.splice(variantIndex, 1);
            return { ...prev, variants: newVariants };
        });
    };

    const addColor = useCallback((variantIndex) => {
        console.log(`Adding color to variant ${variantIndex}`);
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex].colors.push({
                ColorName: "",
                ColorCode: "",
                Stock: 0,
                Images: [],
            });
            console.log("Updated formData:", newVariants);
            return { ...prev, variants: newVariants };
        });
    }, []);

    const removeColor = (variantIndex, colorIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex].colors.splice(colorIndex, 1);
            return { ...prev, variants: newVariants };
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.Name) newErrors.Name = "Vui lòng nhập tên sản phẩm";
        if (!formData.CategoryID)
            newErrors.CategoryID = "Vui lòng chọn danh mục";
        if (!formData.BrandID) newErrors.BrandID = "Vui lòng chọn thương hiệu";

        formData.variants.forEach((variant, variantIndex) => {
            if (!variant.MemorySize) {
                newErrors[`variant${variantIndex}MemorySize`] =
                    "Vui lòng nhập dung lượng";
            }
            if (!variant.Price) {
                newErrors[`variant${variantIndex}Price`] = "Vui lòng nhập giá";
            }
            variant.colors.forEach((color, colorIndex) => {
                if (!color.ColorName) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}ColorName`
                    ] = "Vui lòng nhập tên màu";
                }
                if (!color.ColorCode) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}ColorCode`
                    ] = "Vui lòng nhập mã màu";
                }
                if (color.Stock === 0) {
                    newErrors[`variant${variantIndex}color${colorIndex}Stock`] =
                        "Vui lòng nhập số lượng";
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const productResponse = await axiosAppJson.post("/products", {
                Name: formData.Name,
                Slug: formData.Slug,
                Description: formData.Description,
                CategoryID: formData.CategoryID,
                BrandID: formData.BrandID,
            });

            const productID = productResponse.data.ProductID;

            const variantPromises = formData.variants.map((variant) => {
                return axiosAppJson.post(`/products/${productID}/variants`, {
                    MemorySize: variant.MemorySize,
                    Price: variant.Price,
                    colors: variant.colors.map((color) => ({
                        ColorName: color.ColorName,
                        ColorCode: color.ColorCode,
                        Stock: color.Stock,
                        Images: color.Images.map((image) => ({
                            ImageURL: image.preview, // Assuming `preview` contains the URL of the image
                        })),
                    })),
                });
            });

            await Promise.all(variantPromises);

            navigate("/admin/products");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 sm:px-0">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Thêm sản phẩm mới
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="mt-6">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.Name
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                />
                                {errors.Name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.Name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <textarea
                                    name="Description"
                                    rows={3}
                                    value={formData.Description}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Danh mục
                                </label>
                                <select
                                    name="CategoryID"
                                    value={formData.CategoryID}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.CategoryID
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.CategoryID}
                                            value={category.CategoryID}
                                        >
                                            {category.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.CategoryID && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.CategoryID}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Thương hiệu
                                </label>
                                <select
                                    name="BrandID"
                                    value={formData.BrandID}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.BrandID
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((brand) => (
                                        <option
                                            key={brand.BrandID}
                                            value={brand.BrandID}
                                        >
                                            {brand.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.BrandID && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.BrandID}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Biến thể sản phẩm
                                </h3>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Thêm biến thể
                                </button>
                            </div>

                            {formData.variants.map((variant, variantIndex) => (
                                <div
                                    key={variantIndex}
                                    className="border rounded-lg p-4 mb-4"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Dung lượng
                                            </label>
                                            <input
                                                type="text"
                                                value={variant.MemorySize}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variantIndex,
                                                        "MemorySize",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="VD: 128GB"
                                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Giá
                                            </label>
                                            <input
                                                type="number"
                                                value={variant.Price}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variantIndex,
                                                        "Price",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="text-md font-medium text-gray-900">
                                                Màu sắc
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    addColor(variantIndex)
                                                }
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                            >
                                                Thêm màu mới
                                            </button>
                                        </div>

                                        {variant.colors.map(
                                            (color, colorIndex) => (
                                                <div
                                                    key={colorIndex}
                                                    className="border rounded-lg p-4 mb-4"
                                                >
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Tên màu
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    color.ColorName
                                                                }
                                                                onChange={(e) =>
                                                                    handleColorChange(
                                                                        variantIndex,
                                                                        colorIndex,
                                                                        "ColorName",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Mã màu
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    color.ColorCode
                                                                }
                                                                onChange={(e) =>
                                                                    handleColorChange(
                                                                        variantIndex,
                                                                        colorIndex,
                                                                        "ColorCode",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Số lượng
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={
                                                                    color.Stock
                                                                }
                                                                onChange={(e) =>
                                                                    handleColorChange(
                                                                        variantIndex,
                                                                        colorIndex,
                                                                        "Stock",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-4">
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Ảnh sản phẩm
                                                        </label>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={(e) =>
                                                                handleImageUpload(
                                                                    variantIndex,
                                                                    colorIndex,
                                                                    e
                                                                )
                                                            }
                                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                        />
                                                        <div className="mt-2 grid grid-cols-4 gap-2">
                                                            {color.Images.map(
                                                                (
                                                                    image,
                                                                    imageIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            imageIndex
                                                                        }
                                                                        className="relative"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                image.preview
                                                                            }
                                                                            alt={`Preview ${
                                                                                imageIndex +
                                                                                1
                                                                            }`}
                                                                            className="h-20 w-20 object-cover rounded-lg"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeImage(
                                                                                    variantIndex,
                                                                                    colorIndex,
                                                                                    imageIndex
                                                                                )
                                                                            }
                                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                        >
                                                                            <svg
                                                                                className="h-4 w-4"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M6 18L18 6M6 6l12 12"
                                                                                />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {colorIndex > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeColor(
                                                                    variantIndex,
                                                                    colorIndex
                                                                )
                                                            }
                                                            className="mt-4 text-red-600 hover:text-red-800"
                                                        >
                                                            Xóa màu này
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {variantIndex > 0 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeVariant(variantIndex)
                                            }
                                            className="mt-4 text-red-600 hover:text-red-800"
                                        >
                                            Xóa biến thể này
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Tạo sản phẩm
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProductCreate;
