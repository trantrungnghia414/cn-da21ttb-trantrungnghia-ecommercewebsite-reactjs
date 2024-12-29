import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosAppJson, axiosFromData } from "~/config/axios.config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Name: "",
        Slug: "",
        Description: "",
        CategoryID: "",
        BrandID: "",
        SupplierID: "",
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
    const [suppliers, setSuppliers] = useState([]);
    const [memorySizes, setMemorySizes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    // const [variant, setVariant] = useState({ MemorySize: "" });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCategoriesAndBrandsAndSuppliers = async () => {
            try {
                const [categoriesResponse, brandsResponse, suppliersResponse] =
                    await Promise.all([
                        axiosAppJson.get("/categories"),
                        axiosAppJson.get("/brands"),
                        axiosAppJson.get("/suppliers"),
                    ]);
                setCategories(categoriesResponse.data);
                setBrands(brandsResponse.data);
                setSuppliers(suppliersResponse.data);
            } catch (error) {
                console.error("Error fetching categories and brands:", error);
            }
        };

        const fetchMemorySizes = async () => {
            try {
                const response = await axiosAppJson.get("/memorysizes");
                setMemorySizes(response.data);
            } catch (error) {
                console.error("Lỗi khi tải kích thước bộ nhớ:", error);
            }
        };

        fetchCategoriesAndBrandsAndSuppliers();
        fetchMemorySizes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Thêm Slug tự động dựa vào tên sản phẩm
            ...(name === "Name"
                ? {
                      Slug: value
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/[đĐ]/g, "d")
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, ""),
                  }
                : {}),
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
                    ImageURL: file.name,
                    file: file,
                    preview: URL.createObjectURL(file),
                })
            );
            return { ...prev, variants: newVariants };
        });
    };

    const removeImage = (variantIndex, colorIndex, imageIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            const newImages = newVariants[variantIndex].colors[
                colorIndex
            ].Images.filter((_, idx) => idx !== imageIndex);

            if (
                imageIndex >= 0 &&
                imageIndex <
                    newVariants[variantIndex].colors[colorIndex].Images.length
            ) {
                URL.revokeObjectURL(
                    newVariants[variantIndex].colors[colorIndex].Images[
                        imageIndex
                    ].preview
                );
            }

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
                    Stock: 0,
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

    const addColor = (variantIndex) => {
        console.log(`Adding color to variant ${variantIndex}`);
        const newVariants = [...formData.variants];

        newVariants[variantIndex].colors.push({
            ColorName: "",
            ColorCode: "",
            Stock: 0,
            Images: [],
        });
        setFormData((prev) => ({ ...prev, variants: newVariants }));
    };

    const removeColor = (variantIndex, colorIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex].colors.splice(colorIndex, 1);
            return { ...prev, variants: newVariants };
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate thông tin cơ bản
        if (!formData.Name) {
            newErrors.Name = "Tên sản phẩm không được để trống";
            toast.error("Tên sản phẩm không được để trống");
        } else if (formData.Name.length < 3) {
            newErrors.Name = "Tên sản phẩm phải có ít nhất 3 ký tự";
            toast.error("Tên sản phẩm phải có ít nhất 3 ký tự");
        }

        if (!formData.CategoryID) {
            newErrors.CategoryID = "Vui lòng chọn danh mục sản phẩm";
            toast.error("Vui lòng chọn danh mục sản phẩm");
        }

        if (!formData.BrandID) {
            newErrors.BrandID = "Vui lòng chọn thương hiệu sản phẩm";
            toast.error("Vui lòng chọn thương hiệu sản phẩm");
        }

        if (!formData.SupplierID) {
            newErrors.SupplierID = "Vui lòng chọn nhà cung cấp";
            toast.error("Vui lòng chọn nhà cung cấp");
        }

        // Validate variants
        formData.variants.forEach((variant, variantIndex) => {
            if (!variant.MemorySize) {
                newErrors[`variant${variantIndex}MemorySize`] =
                    "Vui lòng chọn dung lượng bộ nhớ";
                toast.error(
                    `Biến thể ${
                        variantIndex + 1
                    }: Vui lòng chọn dung lượng bộ nhớ`
                );
            }

            if (!variant.Price) {
                newErrors[`variant${variantIndex}Price`] =
                    "Vui lòng nhập giá sản phẩm";
                toast.error(
                    `Biến thể ${variantIndex + 1}: Vui lòng nhập giá sản phẩm`
                );
            } else {
                const price = parseFloat(variant.Price);
                if (isNaN(price)) {
                    newErrors[`variant${variantIndex}Price`] =
                        "Giá phải là một số";
                    toast.error(
                        `Biến thể ${variantIndex + 1}: Giá phải là một số`
                    );
                } else if (price <= 0) {
                    newErrors[`variant${variantIndex}Price`] =
                        "Giá phải lớn hơn 0";
                    toast.error(
                        `Biến thể ${variantIndex + 1}: Giá phải lớn hơn 0`
                    );
                } else if (price > 1000000000) {
                    // 1 tỷ VNĐ
                    newErrors[`variant${variantIndex}Price`] =
                        "Giá không được vượt quá 1 tỷ VNĐ";
                    toast.error(
                        `Biến thể ${
                            variantIndex + 1
                        }: Giá không được vượt quá 1 tỷ VNĐ`
                    );
                }
            }

            // Validate colors
            variant.colors.forEach((color, colorIndex) => {
                if (!color.ColorName) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}ColorName`
                    ] = "Vui lòng nhập tên màu";
                    toast.error(
                        `Biến thể ${variantIndex + 1}, Màu ${
                            colorIndex + 1
                        }: Vui lòng nhập tên màu`
                    );
                } else if (color.ColorName.length < 2) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}ColorName`
                    ] = "Tên màu phải có ít nhất 2 ký tự";
                    toast.error(
                        `Biến thể ${variantIndex + 1}, Màu ${
                            colorIndex + 1
                        }: Tên màu phải có ít nhất 2 ký tự`
                    );
                }

                if (!color.ColorCode) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}ColorCode`
                    ] = "Vui lòng chọn mã màu";
                    toast.error(
                        `Biến thể ${variantIndex + 1}, Màu ${
                            colorIndex + 1
                        }: Vui lòng chọn mã màu`
                    );
                }

                if (!color.Stock && color.Stock !== 0) {
                    newErrors[`variant${variantIndex}color${colorIndex}Stock`] =
                        "Vui lòng nhập số lượng tồn kho";
                    toast.error(
                        `Biến thể ${variantIndex + 1}, Màu ${
                            colorIndex + 1
                        }: Vui lòng nhập số lượng tồn kho`
                    );
                } else {
                    const stock = parseInt(color.Stock);
                    if (isNaN(stock)) {
                        newErrors[
                            `variant${variantIndex}color${colorIndex}Stock`
                        ] = "Số lượng phải là một số";
                        toast.error(
                            `Biến thể ${variantIndex + 1}, Màu ${
                                colorIndex + 1
                            }: Số lượng phải là một số`
                        );
                    } else if (stock < 0) {
                        newErrors[
                            `variant${variantIndex}color${colorIndex}Stock`
                        ] = "Số lượng không được âm";
                        toast.error(
                            `Biến thể ${variantIndex + 1}, Màu ${
                                colorIndex + 1
                            }: Số lượng không được âm`
                        );
                    } else if (stock > 1000) {
                        newErrors[
                            `variant${variantIndex}color${colorIndex}Stock`
                        ] = "Số lượng không được vượt quá 1000";
                        toast.error(
                            `Biến thể ${variantIndex + 1}, Màu ${
                                colorIndex + 1
                            }: Số lượng không được vượt quá 1000`
                        );
                    }
                }

                if (color.Images.length === 0) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}Images`
                    ] = "Vui lòng thêm ít nhất một ảnh cho màu này";
                    toast.error(
                        `Biến thể ${variantIndex + 1}, Màu ${
                            colorIndex + 1
                        }: Vui lòng thêm ít nhất một ảnh`
                    );
                } else if (color.Images.length > 8) {
                    newErrors[
                        `variant${variantIndex}color${colorIndex}Images`
                    ] = "Không được thêm quá 8 ảnh cho một màu";
                    toast.error(
                        `Biến thể ${variantIndex + 1}, Màu ${
                            colorIndex + 1
                        }: Không được thêm quá 8 ảnh cho một màu`
                    );
                }
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!formData.Slug) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                Slug: "Slug không thể để trống",
            }));
            return;
        }

        // Tạo FormData object
        const productData = new FormData();

        // Thêm các trường dữ liệu cơ bản
        productData.append("Name", formData.Name);
        productData.append("Slug", formData.Slug);
        productData.append("Description", formData.Description);
        productData.append("CategoryID", formData.CategoryID);
        productData.append("BrandID", formData.BrandID);
        productData.append("SupplierID", formData.SupplierID);

        // Chuyển đổi variants thành chuỗi JSON
        const variantsData = formData.variants.map((variant) => ({
            MemorySize: variant.MemorySize,
            Price: variant.Price,
            colors: variant.colors.map((color) => ({
                ColorName: color.ColorName,
                ColorCode: color.ColorCode,
                Stock: color.Stock,
                Images: color.Images.map((image) => ({
                    ImageURL: image.ImageURL,
                })),
            })),
        }));

        // Thêm variants dưới dạng chuỗi JSON
        productData.append("Variants", JSON.stringify(variantsData));

        // Thêm các file ảnh
        formData.variants.forEach((variant) => {
            variant.colors.forEach((color) => {
                color.Images.forEach((image) => {
                    if (image.file) {
                        productData.append("images", image.file);
                    }
                });
            });
        });

        try {
            const response = await axiosFromData.post("/products", productData);
            console.log("Sản phẩm đã được tạo:", response.data);
            toast.success("Tạo sản phẩm thành công!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Lỗi khi tạo sản phẩm:", error);
            setErrors({ submit: "Có lỗi xảy ra khi tạo sản phẩm" });
            toast.error("Có lỗi xảy ra khi tạo sản phẩm");
        }
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategory(value);
        setFormData((prev) => ({
            ...prev,
            CategoryID: value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, CategoryID: "" }));
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nhà cung cấp
                                </label>
                                <select
                                    name="SupplierID"
                                    value={formData.SupplierID}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Chọn nhà cung cấp</option>
                                    {suppliers.map((supplier) => (
                                        <option
                                            key={supplier.SupplierID}
                                            value={supplier.SupplierID}
                                        >
                                            {supplier.Name}
                                        </option>
                                    ))}
                                </select>
                                {errors.SupplierID && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.SupplierID}
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
                                    className="border rounded-lg p-4 mb-4 bg-slate-100"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Dung lượng
                                            </label>
                                            <select
                                                value={variant.MemorySize}
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        variantIndex,
                                                        "MemorySize",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            >
                                                <option value="">
                                                    Chọn dung lượng
                                                </option>
                                                {memorySizes
                                                    .filter(
                                                        (size) =>
                                                            size.CategoryID ===
                                                            parseInt(
                                                                selectedCategory
                                                            )
                                                    )
                                                    .map((size) => (
                                                        <option
                                                            key={
                                                                size.MemorySizeID
                                                            }
                                                            value={
                                                                size.MemorySize
                                                            }
                                                        >
                                                            {size.MemorySize}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors.MemorySize && (
                                                <p className="mt-1 text-sm text-red-500">
                                                    {errors.MemorySize}
                                                </p>
                                            )}
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
                                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                                            >
                                                Thêm màu mới
                                            </button>
                                        </div>

                                        {variant.colors.map(
                                            (color, colorIndex) => (
                                                <div
                                                    key={colorIndex}
                                                    className="border rounded-lg p-4 mb-4 bg-white"
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
                                                                placeholder="Màu trắng"
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
                                                                placeholder="#ffffff"
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
