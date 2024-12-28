import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductEdit() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [memorySizes, setMemorySizes] = useState([]);
    const [filteredMemorySizes, setFilteredMemorySizes] = useState([]);
    const [formData, setFormData] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [
                    productResponse,
                    categoriesResponse,
                    brandsResponse,
                    suppliersResponse,
                    memorySizesResponse,
                ] = await Promise.all([
                    axiosAppJson.get(`/products/${slug}`),
                    axiosAppJson.get("/categories"),
                    axiosAppJson.get("/brands"),
                    axiosAppJson.get("/suppliers"),
                    axiosAppJson.get("/memorysizes"),
                ]);

                const product = productResponse.data;
                setFormData({
                    Name: product.Name,
                    Description: product.Description || "",
                    CategoryID: product.CategoryID.toString(),
                    BrandID: product.BrandID.toString(),
                    SupplierID: product.SupplierID.toString(),
                    variants: product.variants.map((variant) => ({
                        MemorySize: variant.memorySize.MemorySize,
                        Price: variant.Price ? variant.Price.toString() : "0",
                        colors: variant.colors.map((color) => ({
                            ColorName: color.ColorName,
                            ColorCode: color.ColorCode,
                            Stock: color.Stock,
                            Images: color.images
                                ? color.images.map((image) => ({
                                      file: null,
                                      url: image.ImageURL,
                                      isExisting: true,
                                  }))
                                : [],
                        })),
                    })),
                });

                setCategories(categoriesResponse.data);
                setBrands(brandsResponse.data);
                setSuppliers(suppliersResponse.data);
                setMemorySizes(memorySizesResponse.data);
                setSelectedCategory(product.CategoryID.toString());

                // Lọc dung lượng theo danh mục ban đầu
                const filteredSizes = memorySizesResponse.data.filter(
                    (size) =>
                        size.CategoryID.toString() ===
                        product.CategoryID.toString()
                );
                setFilteredMemorySizes(filteredSizes);

                setLoading(false);
            } catch (error) {
                setError("Không thể tải dữ liệu");
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setFormData((prev) => ({
            ...prev,
            CategoryID: categoryId,
        }));

        // Lọc dung lượng ngay khi thay đổi danh mục
        const filteredSizes = memorySizes.filter(
            (size) => size.CategoryID.toString() === categoryId
        );
        setFilteredMemorySizes(filteredSizes);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "CategoryID") {
            fetchMemorySizes(value);
        }

        // Khi danh mục thay đổi, cập nhật dung lượng tương ứng
        if (name === "CategoryID") {
            // Cập nhật dung lượng đã lọc theo danh mục mới
            const filteredSizes = memorySizes.filter(
                (size) => size.CategoryID === value
            );
            setFilteredMemorySizes(filteredSizes);
        }
    };

    const fetchMemorySizes = async (categoryId) => {
        try {
            const response = await axiosAppJson.get(
                `/memorysizes?categoryId=${categoryId}`
            );
            setMemorySizes(response.data);
            setFilteredMemorySizes(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dung lượng:", error);
        }
    };

    const validateVariantMemorySize = (memorySize, currentVariantIndex) => {
        return formData.variants.every((variant, index) => {
            // Bỏ qua variant hiện tại khi kiểm tra
            if (index === currentVariantIndex) {
                return true;
            }
            // Kiểm tra xem có trùng với variant khác không
            return variant.MemorySize !== memorySize;
        });
    };

    const handleVariantChange = (index, field, value) => {
        if (field === "MemorySize") {
            // Kiểm tra xem dung lượng đã tồn tại trong variant khác chưa
            const isDuplicate = !validateVariantMemorySize(value, index);
            if (isDuplicate) {
                toast.error("Dung lượng này đã tồn tại trong biến thể khác!");
                return;
            }
        }

        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[index] = {
                ...newVariants[index],
                [field]: field === "Price" ? value.toString() : value,
            };
            return { ...prev, variants: newVariants };
        });
    };

    const handleColorChange = (variantIndex, colorIndex, field, value) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            const newColors = [...newVariants[variantIndex].colors];
            newColors[colorIndex] = {
                ...newColors[colorIndex],
                [field]: value,
            };
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                colors: newColors,
            };
            return { ...prev, variants: newVariants };
        });
    };

    const handleImageChange = (variantIndex, colorIndex, e) => {
        const files = Array.from(e.target.files);

        setFormData((prev) => {
            const newVariants = [...prev.variants];
            const newColors = [...newVariants[variantIndex].colors];

            // Giữ lại các ảnh cũ có isExisting = true
            const existingImages =
                newColors[colorIndex].Images.filter((img) => img.isExisting) ||
                [];

            // Thêm ảnh mới
            const newImages = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
                isExisting: false,
            }));

            newColors[colorIndex] = {
                ...newColors[colorIndex],
                Images: [...existingImages, ...newImages], // Kết hợp ảnh cũ và mới
            };

            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                colors: newColors,
            };
            return { ...prev, variants: newVariants };
        });
    };

    const addVariant = () => {
        // Lấy danh sách dung lượng đã được sử dụng
        const usedMemorySizes = formData.variants.map(
            (variant) => variant.MemorySize
        );

        // Tìm dung lượng đầu tiên chưa được sử dụng
        const availableMemorySize = filteredMemorySizes.find(
            (size) => !usedMemorySizes.includes(size.MemorySize)
        );

        if (!availableMemorySize) {
            toast.error("Tất cả dung lượng đã được sử dụng!");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    MemorySize: availableMemorySize.MemorySize,
                    Price: "",
                    colors: [
                        {
                            ColorName: "",
                            ColorCode: "",
                            Stock: "0",
                            Images: [],
                        },
                    ],
                },
            ],
        }));
    };

    const addColor = (variantIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            const newColors = [...newVariants[variantIndex].colors];

            // Thêm một màu mới
            newColors.push({
                ColorName: "",
                ColorCode: "",
                Stock: "",
                Images: [],
            });

            // Cập nhật variant với màu mới
            newVariants[variantIndex] = {
                ...newVariants[variantIndex],
                colors: newColors,
            };

            return {
                ...prev,
                variants: newVariants,
            };
        });
    };

    const removeVariant = (index) => {
        // Kiểm tra xem variant có tồn tại không
        if (!formData.variants[index]) return;

        // Lấy thông tin variant sẽ bị xóa
        const variantToRemove = formData.variants[index];

        setFormData((prev) => {
            const newVariants = prev.variants.filter((_, i) => i !== index);

            // Nếu không còn variant nào, thêm một variant mới mặc định
            if (newVariants.length === 0) {
                const defaultMemorySize = filteredMemorySizes[0]?.MemorySize;
                if (defaultMemorySize) {
                    newVariants.push({
                        MemorySize: defaultMemorySize,
                        Price: "0",
                        colors: [
                            {
                                ColorName: "",
                                ColorCode: "",
                                Stock: "0",
                                Images: [],
                            },
                        ],
                    });
                }
            }

            return { ...prev, variants: newVariants };
        });
    };

    const removeColor = (variantIndex, colorIndex) => {
        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[variantIndex].colors = newVariants[
                variantIndex
            ].colors.filter((_, i) => i !== colorIndex);
            return { ...prev, variants: newVariants };
        });
    };

    const validateForm = () => {
        const newErrors = {};
        console.log("Starting form validation");

        if (!formData.Name?.trim()) {
            newErrors.Name = "Tên sản phẩm không được để trống";
        }

        if (!formData.CategoryID) {
            newErrors.CategoryID = "Vui lòng chọn danh mục";
        }

        if (!formData.BrandID) {
            newErrors.BrandID = "Vui lòng chọn thương hiệu";
        }

        // Kiểm tra chi tiết từng variant
        formData.variants.forEach((variant, variantIndex) => {
            console.log(`Validating variant ${variantIndex}:`, variant);

            // Kiểm tra MemorySize có tồn tại trong danh sách đã lọc
            const isValidMemorySize = filteredMemorySizes.some(
                (size) => size.MemorySize === variant.MemorySize
            );

            if (!variant.MemorySize || !isValidMemorySize) {
                newErrors[`variant${variantIndex}MemorySize`] =
                    "Vui lòng chọn dung lượng hợp lệ";
            }

            if (
                !variant.Price ||
                isNaN(parseFloat(variant.Price)) ||
                parseFloat(variant.Price) <= 0
            ) {
                newErrors[`variant${variantIndex}Price`] =
                    "Vui lòng nhập giá hợp lệ";
            }

            // Kiểm tra colors
            variant.colors.forEach((color, colorIndex) => {
                console.log(
                    `Validating color ${colorIndex} of variant ${variantIndex}:`,
                    color
                );

                if (!color.ColorName?.trim()) {
                    newErrors[`variant${variantIndex}color${colorIndex}Name`] =
                        "Tên màu không được để trống";
                }
                if (!color.ColorCode?.trim()) {
                    newErrors[`variant${variantIndex}color${colorIndex}Code`] =
                        "Mã màu không được để trống";
                }
                if (
                    !color.Stock ||
                    isNaN(parseInt(color.Stock)) ||
                    parseInt(color.Stock) < 0
                ) {
                    newErrors[`variant${variantIndex}color${colorIndex}Stock`] =
                        "Số lượng không hợp lệ";
                }
            });
        });

        console.log("Validation errors:", newErrors);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Vui lòng kiểm tra lại thông tin!");
            return;
        }

        try {
            const productData = new FormData();
            productData.append("Name", formData.Name);
            productData.append("Description", formData.Description || "");
            productData.append("CategoryID", formData.CategoryID);
            productData.append("BrandID", formData.BrandID);
            productData.append("SupplierID", formData.SupplierID);

            // Chuẩn bị dữ liệu variants
            const variantsData = formData.variants.map((variant) => {
                return {
                    MemorySize: variant.MemorySize,
                    Price: variant.Price,
                    colors: variant.colors.map((color) => {
                        const newImages = color.Images.filter(
                            (img) => !img.isExisting
                        );
                        return {
                            ColorName: color.ColorName,
                            ColorCode: color.ColorCode,
                            Stock: color.Stock,
                            hasNewImages: newImages.length > 0,
                            newImagesCount: newImages.length,
                            existingImages: color.Images.filter(
                                (img) => img.isExisting
                            ).map((img) => img.url),
                        };
                    }),
                };
            });

            productData.append("Variants", JSON.stringify(variantsData));

            // Thêm các file ảnh mới với thông tin về variant và color
            let imageIndex = 0;
            formData.variants.forEach((variant, variantIndex) => {
                variant.colors.forEach((color, colorIndex) => {
                    const newImages = color.Images.filter(
                        (img) => !img.isExisting
                    );
                    newImages.forEach((image) => {
                        if (image.file) {
                            // Thêm metadata cho mỗi ảnh
                            productData.append(`images`, image.file);
                            productData.append(
                                `imageMetadata_${imageIndex}`,
                                JSON.stringify({
                                    variantIndex,
                                    colorIndex,
                                    fileName: image.file.name,
                                })
                            );
                            imageIndex++;
                        }
                    });
                });
            });

            // Thêm tổng số ảnh
            productData.append("totalImages", imageIndex);

            // Log dữ liệu trước khi gửi
            console.log("Variants data:", variantsData);
            console.log("Total images:", imageIndex);
            console.log("Form data entries:", [...productData.entries()]);

            const response = await axiosAppJson.put(
                `/products/${slug}`,
                productData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("Server response:", response.data);
            toast.success("Cập nhật sản phẩm thành công!");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error details:", error);
            console.error("Server error response:", error.response?.data);
            const errorMessage =
                error.response?.data?.error ||
                "Có lỗi xảy ra khi cập nhật sản phẩm";
            toast.error(errorMessage);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!formData) return <div>Không tìm thấy sản phẩm</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    className="h-10 pl-4 border-[1px] mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {errors.Name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.Name}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-6">
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <textarea
                                    name="Description"
                                    rows={3}
                                    value={formData.Description}
                                    onChange={handleChange}
                                    className="border-[1px] py-2 px-4 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Danh mục
                                </label>
                                <select
                                    name="CategoryID"
                                    value={formData.CategoryID}
                                    onChange={handleCategoryChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.CategoryID}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Thương hiệu
                                </label>
                                <select
                                    name="BrandID"
                                    value={formData.BrandID}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.BrandID}
                                    </p>
                                )}
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Nhà cung cấp
                                </label>
                                <select
                                    name="SupplierID"
                                    value={formData.SupplierID}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.SupplierID}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Variants Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Biến thể sản phẩm
                            </h3>
                            <div className="mt-4 space-y-6">
                                {formData.variants.map(
                                    (variant, variantIndex) => (
                                        <div
                                            key={variantIndex}
                                            className="border rounded-lg p-4 bg-gray-100"
                                        >
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Dung lượng
                                                    </label>
                                                    <select
                                                        name="MemorySize"
                                                        value={
                                                            variant.MemorySize ||
                                                            ""
                                                        }
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
                                                        {filteredMemorySizes.map(
                                                            (size) => (
                                                                <option
                                                                    key={
                                                                        size.MemorySizeID
                                                                    }
                                                                    value={
                                                                        size.MemorySize
                                                                    }
                                                                >
                                                                    {
                                                                        size.MemorySize
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>

                                                <div className="col-span-6 sm:col-span-3">
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
                                                        className="border-[1px] h-10 pl-4 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                    {errors[
                                                        `variant${variantIndex}Price`
                                                    ] && (
                                                        <p className="mt-2 text-sm text-red-600">
                                                            {
                                                                errors[
                                                                    `variant${variantIndex}Price`
                                                                ]
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Colors Section */}
                                            <div className="mt-6">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    Màu sắc
                                                </h4>
                                                <div className="mt-4 space-y-4">
                                                    {variant.colors.map(
                                                        (color, colorIndex) => (
                                                            <div
                                                                key={colorIndex}
                                                                className="border rounded-lg p-6 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
                                                            >
                                                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Tên
                                                                            màu
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                color.ColorName
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleColorChange(
                                                                                    variantIndex,
                                                                                    colorIndex,
                                                                                    "ColorName",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="border-[1px] px-4 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10"
                                                                            placeholder="Nhập tên màu"
                                                                        />
                                                                    </div>

                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Mã
                                                                            màu
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                color.ColorCode
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleColorChange(
                                                                                    variantIndex,
                                                                                    colorIndex,
                                                                                    "ColorCode",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="border-[1px] px-4 mt-1 block w-full h-10 border-gray-300 rounded-md"
                                                                        />
                                                                    </div>

                                                                    <div className="col-span-1">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            Số
                                                                            lượng
                                                                        </label>
                                                                        <input
                                                                            type="number"
                                                                            value={
                                                                                color.Stock
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleColorChange(
                                                                                    variantIndex,
                                                                                    colorIndex,
                                                                                    "Stock",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="border-[1px] px-4 h-10 mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                                            placeholder="Nhập số lượng"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Image Upload */}
                                                                <div className="mt-6">
                                                                    <label className="block text-sm font-medium text-gray-700">
                                                                        Hình ảnh
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        multiple
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleImageChange(
                                                                                variantIndex,
                                                                                colorIndex,
                                                                                e
                                                                            )
                                                                        }
                                                                        className="mt-1 block w-full text-sm text-gray-500
                                                                    file:mr-4 file:py-2 file:px-4
                                                                    file:rounded-md file:border-0
                                                                    file:text-sm file:font-semibold
                                                                    file:bg-blue-50 file:text-blue-700
                                                                    hover:file:bg-blue-100"
                                                                        accept="image/*"
                                                                    />
                                                                </div>

                                                                {/* Preview Images */}
                                                                <div className="mt-4 grid grid-cols-8 gap-4">
                                                                    {color.Images?.map(
                                                                        (
                                                                            image,
                                                                            imageIndex
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    imageIndex
                                                                                }
                                                                                className="relative border rounded-lg overflow-hidden shadow-sm"
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        image.url
                                                                                    }
                                                                                    alt={`Preview ${imageIndex}`}
                                                                                    className="w-full h-full p-2 object-cover rounded"
                                                                                />
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>

                                                                {colorIndex >
                                                                    0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeColor(
                                                                                variantIndex,
                                                                                colorIndex
                                                                            )
                                                                        }
                                                                        className="mt-4 text-red-600 hover:text-red-800 font-semibold"
                                                                    >
                                                                        Xóa màu
                                                                        này
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addColor(variantIndex)
                                                    }
                                                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Thêm màu mới
                                                </button>
                                            </div>

                                            {variantIndex > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeVariant(
                                                            variantIndex
                                                        )
                                                    }
                                                    className="mt-4 text-red-600 hover:text-red-800"
                                                >
                                                    Xóa biến thể này
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={addVariant}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Thêm biến thể mới
                            </button>
                        </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-3">
                        <Link
                            to="/admin/products"
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProductEdit;
