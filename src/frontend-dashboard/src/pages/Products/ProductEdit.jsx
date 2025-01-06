import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { axiosAppJson } from "~/config/axios.config";
import { toast } from "react-hot-toast";
import { axiosFromData } from "~/config/axios.config";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

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
    const [formData, setFormData] = useState({
        Name: "",
        Slug: "",
        Description: "",
        CategoryID: "",
        BrandID: "",
        SupplierID: "",
        Thumbnail: "",
        variants: [],
    });
    const [errors, setErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [deletedVariants, setDeletedVariants] = useState([]);
    const [changedColors, setChangedColors] = useState({});
    const [memorySizeChanges, setMemorySizeChanges] = useState({});

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
                    axiosAppJson.get(`/api/products/${slug}`),
                    axiosAppJson.get("/api/categories"),
                    axiosAppJson.get("/api/brands"),
                    axiosAppJson.get("/api/suppliers"),
                    axiosAppJson.get("/api/memorysizes"),
                ]);

                const product = productResponse.data;
                setFormData({
                    Name: product.Name,
                    Description: product.Description || "",
                    CategoryID: product.CategoryID.toString(),
                    BrandID: product.BrandID.toString(),
                    SupplierID: product.SupplierID.toString(),
                    Thumbnail: product.Thumbnail,
                    variants: product.variants.map((variant) => ({
                        VariantID: variant.VariantID,
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

                if (product.Thumbnail) {
                    setThumbnailPreview(product.Thumbnail);
                }

                setCategories(categoriesResponse.data);
                setBrands(brandsResponse.data);
                setSuppliers(suppliersResponse.data);
                setMemorySizes(memorySizesResponse.data);
                setSelectedCategory(product.CategoryID.toString());

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

        if (name === "CategoryID") {
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
            if (index === currentVariantIndex) {
                return true;
            }
            return variant.MemorySize !== memorySize;
        });
    };

    const handleVariantChange = (index, field, value) => {
        if (field === "MemorySize") {
            const isDuplicate = !validateVariantMemorySize(value, index);
            if (isDuplicate) {
                toast.error("Dung lượng này đã tồn tại trong biến thể khác!");
                return;
            }

            const variant = formData.variants[index];
            if (variant.VariantID) {
                setMemorySizeChanges((prev) => ({
                    ...prev,
                    [variant.VariantID]: {
                        oldSize: variant.MemorySize,
                        newSize: value,
                    },
                }));
            }
        }

        setFormData((prev) => {
            const newVariants = [...prev.variants];
            newVariants[index] = {
                ...newVariants[index],
                [field]: value,
            };
            return { ...prev, variants: newVariants };
        });
    };

    const handleColorChange = (variantIndex, colorIndex, field, value) => {
        console.log("Color change:", {
            variantIndex,
            colorIndex,
            field,
            value,
        });

        setFormData((prev) => {
            const newVariants = [...prev.variants];
            const color = newVariants[variantIndex].colors[colorIndex];

            // Lưu giá trị cũ trước khi thay đổi
            const oldValue = color[field];
            color[field] = value;

            // Nếu thay đổi ColorName hoặc ColorCode, đánh dấu là đã thay đổi
            if (
                (field === "ColorName" || field === "ColorCode") &&
                oldValue !== value
            ) {
                setChangedColors((prev) => ({
                    ...prev,
                    [`${variantIndex}-${colorIndex}`]: true,
                }));
            }

            return { ...prev, variants: newVariants };
        });
    };

    const handleImageChange = (variantIndex, colorIndex, e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData((prev) => {
                const newVariants = [...prev.variants];
                const variant = newVariants[variantIndex];
                const color = variant.colors[colorIndex];

                // Giữ lại ảnh cũ
                const existingImages =
                    color.Images.filter((img) => img.isExisting) || [];

                // Tạo URL preview cho ảnh mới
                const newImages = files.map((file) => ({
                    file: file,
                    url: URL.createObjectURL(file),
                    isExisting: false,
                }));

                // Cập nhật state
                color.Images = [...existingImages, ...newImages];
                color.hasNewImages = "true";

                return { ...prev, variants: newVariants };
            });
        }
    };

    const addVariant = () => {
        const usedMemorySizes = formData.variants.map(
            (variant) => variant.MemorySize
        );

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

            newColors.push({
                ColorName: "",
                ColorCode: "",
                Stock: "",
                Images: [],
            });

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
        const variantToRemove = formData.variants[index];
        console.log("Removing variant:", variantToRemove);

        if (variantToRemove?.VariantID) {
            console.log(
                "Adding to deletedVariants:",
                variantToRemove.VariantID
            );
            setDeletedVariants((prev) => [...prev, variantToRemove.VariantID]);
        }

        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
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
                    newErrors[`variant${variantIndex}Price`] =
                        "Giá không được vượt quá 1 tỷ VNĐ";
                    toast.error(
                        `Biến thể ${
                            variantIndex + 1
                        }: Giá không được vượt quá 1 tỷ VNĐ`
                    );
                }
            }

            variant.colors.forEach((color, colorIndex) => {
                const colorKey = `${variantIndex}-${colorIndex}`;
                const hasColorChanged = changedColors[colorKey];

                // Kiểm tra nếu màu đã thay đổi
                if (hasColorChanged) {
                    const hasNewImages = color.Images.some(
                        (img) => !img.isExisting
                    );
                    if (!hasNewImages) {
                        newErrors[
                            `variant${variantIndex}color${colorIndex}Images`
                        ] =
                            "Bạn phải upload ảnh mới khi thay đổi thông tin màu";
                        toast.error(
                            `Biến thể ${variantIndex + 1}, Màu ${
                                colorIndex + 1
                            }: Yêu cầu upload ảnh mới khi thay đổi thông tin màu`
                        );
                    }
                } else {
                    // Nếu màu không thay đổi, giữ nguyên ảnh cũ
                    const existingImages = color.Images.filter(
                        (img) => img.isExisting
                    ).length;
                    if (existingImages === 0) {
                        newErrors[
                            `variant${variantIndex}color${colorIndex}Images`
                        ] = "Vui lòng thêm ít nhất một ảnh cho màu này";
                        toast.error(
                            `Biến thể ${variantIndex + 1}, Màu ${
                                colorIndex + 1
                            }: Vui lòng thêm ít nhất một ảnh`
                        );
                    }
                }

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
            });
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        return () => {
            if (thumbnailPreview && !thumbnailPreview.includes("http")) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const productData = new FormData();
            const colorKeys = [];

            // Append thông tin cơ bản
            productData.append("Name", formData.Name);
            productData.append("Description", formData.Description || "");
            productData.append("CategoryID", formData.CategoryID);
            productData.append("BrandID", formData.BrandID);
            productData.append("SupplierID", formData.SupplierID);

            // Xử lý variants và images
            const variantsData = formData.variants.map((variant) => ({
                ...variant,
                colors: variant.colors.map((color) => ({
                    ...color,
                    // Chỉ gửi thông tin cần thiết, không gửi file
                    Images: color.Images.filter((img) => img.isExisting).map(
                        (img) => ({
                            ImageURL: img.url || img.ImageURL,
                        })
                    ),
                })),
            }));

            productData.append("Variants", JSON.stringify(variantsData));

            // Xử lý thumbnail mới nếu có
            if (newThumbnail) {
                productData.append("thumbnail", newThumbnail);
                productData.append("hasNewThumbnail", "true");
            }

            // Xử lý ảnh sản phẩm mới
            formData.variants.forEach((variant, variantIndex) => {
                variant.colors.forEach((color, colorIndex) => {
                    if (color.hasNewImages === "true") {
                        color.Images.forEach((image) => {
                            if (!image.isExisting && image.file) {
                                productData.append("productImages", image.file);
                                colorKeys.push(
                                    `${variant.MemorySize}-${color.ColorName}`
                                );
                            }
                        });
                    }
                });
            });

            if (colorKeys.length > 0) {
                productData.append("colorKeys", JSON.stringify(colorKeys));
            }

            // Thêm thông tin về các biến thể đã xóa
            if (deletedVariants.length > 0) {
                productData.append(
                    "deletedVariants",
                    JSON.stringify(deletedVariants)
                );
            }

            // Thêm thông tin về thay đổi dung lượng
            if (Object.keys(memorySizeChanges).length > 0) {
                productData.append(
                    "memorySizeChanges",
                    JSON.stringify(memorySizeChanges)
                );
            }

            // Gửi request
            const response = await axiosFromData.put(
                `/api/products/${slug}`,
                productData
            );

            toast.success("Cập nhật sản phẩm thành công");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(
                error.response?.data?.error || "Lỗi khi cập nhật sản phẩm"
            );
        }
    };

    useEffect(() => {
        return () => {
            // Cleanup tất cả URL preview khi component unmount
            formData?.variants?.forEach((variant) => {
                variant.colors?.forEach((color) => {
                    color.Images?.forEach((image) => {
                        if (!image.isExisting && image.previewUrl) {
                            URL.revokeObjectURL(image.previewUrl);
                        }
                    });
                });
            });
        };
    }, [formData]);

    // Thêm hàm xử lý thay đổi nội dung CKEditor
    const handleEditorChange = (event, editor) => {
        const data = editor.getData();
        setFormData((prev) => ({
            ...prev,
            Description: data,
        }));
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div>{error}</div>;
    if (!formData) return <div>Không tìm thấy sản phẩm</div>;

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit}>
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
                                    className="h-10 pl-4 border-[1px] mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                {errors.Name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.Name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <div className="mt-1">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={formData.Description || ""}
                                        onChange={handleEditorChange}
                                        config={{
                                            toolbar: [
                                                "heading",
                                                "|",
                                                "bold",
                                                "italic",
                                                "link",
                                                "bulletedList",
                                                "numberedList",
                                                "|",
                                                "outdent",
                                                "indent",
                                                "|",
                                                "blockQuote",
                                                "insertTable",
                                                "mediaEmbed",
                                                "undo",
                                                "redo",
                                            ],
                                            language: "vi",
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
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

                            <div>
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

                            <div>
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Ảnh thumbnail
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="file"
                                        id="thumbnail-upload"
                                        name="thumbnail"
                                        onChange={handleThumbnailUpload}
                                        className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="mt-4 grid grid-cols-8 gap-4">
                                    {formData.Thumbnail && (
                                        <div className="relative border rounded-lg overflow-hidden shadow-sm">
                                            <img
                                                src={formData.Thumbnail}
                                                alt="Current thumbnail"
                                                className="w-full h-full p-2 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    {newThumbnail && (
                                        <div className="relative border rounded-lg overflow-hidden shadow-sm">
                                            <img
                                                src={thumbnailPreview}
                                                alt="New thumbnail preview"
                                                className="w-full h-full p-2 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

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

                                                                <div className="mt-4 grid grid-cols-10 gap-4">
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

                                                                {changedColors[
                                                                    `${variantIndex}-${colorIndex}`
                                                                ] && (
                                                                    <div className="text-yellow-600 text-sm mt-2">
                                                                        * Bạn đã
                                                                        thay đổi
                                                                        thông
                                                                        tin màu.
                                                                        Vui lòng
                                                                        upload
                                                                        ảnh mới.
                                                                    </div>
                                                                )}

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
