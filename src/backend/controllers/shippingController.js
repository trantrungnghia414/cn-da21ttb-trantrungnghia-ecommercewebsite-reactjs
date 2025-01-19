const axios = require("axios");

// GHN API configs
const GHN_DEV_URL =
    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data";
const GHN_TOKEN = process.env.GHN_TOKEN; // Token test của GHN
const GHN_SHOP_ID = process.env.GHN_SHOP_ID; // Shop ID test của GHN

exports.getProvinces = async (req, res) => {
    try {
        const response = await axios.get(`${GHN_DEV_URL}/province`, {
            headers: {
                Token: GHN_TOKEN,
                shop_id: GHN_SHOP_ID,
                "Content-Type": "application/json",
            },
        });

        console.log("GHN Response:", response.data); // Thêm log để debug

        const provinces = response.data.data.map((p) => ({
            code: p.ProvinceID,
            name: p.ProvinceName,
        }));

        res.json(provinces);
    } catch (error) {
        console.error("Error details:", error.response?.data); // Log chi tiết lỗi
        console.error("Error fetching provinces:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getDistricts = async (req, res) => {
    try {
        const { provinceCode } = req.params;
        const response = await axios.get(`${GHN_DEV_URL}/district`, {
            headers: {
                Token: GHN_TOKEN,
                "Content-Type": "application/json",
            },
            params: {
                province_id: parseInt(provinceCode),
            },
        });

        const districts = response.data.data.map((d) => ({
            code: d.DistrictID,
            name: d.DistrictName,
        }));

        res.json(districts);
    } catch (error) {
        console.error("Error fetching districts:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getWards = async (req, res) => {
    try {
        const { districtCode } = req.params;
        const response = await axios.get(`${GHN_DEV_URL}/ward`, {
            headers: {
                Token: GHN_TOKEN,
                "Content-Type": "application/json",
            },
            params: {
                district_id: parseInt(districtCode),
            },
        });

        const wards = response.data.data.map((w) => ({
            code: w.WardCode,
            name: w.WardName,
        }));

        res.json(wards);
    } catch (error) {
        console.error("Error fetching wards:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.calculateFee = async (req, res) => {
    try {
        const { districtCode, wardCode } = req.body;

        const response = await axios.post(
            "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
                from_district_id: 1454, // District ID của shop (Quận 1, HCM)
                from_ward_code: "20308", // Ward code của shop
                to_district_id: parseInt(districtCode),
                to_ward_code: wardCode,
                service_type_id: 2,
                weight: 200,
                length: 20,
                width: 10,
                height: 10,
            },
            {
                headers: {
                    Token: GHN_TOKEN,
                    ShopId: GHN_SHOP_ID,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error calculating shipping fee:", error);
        res.status(500).json({ message: error.message });
    }
};
