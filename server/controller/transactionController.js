const Product = require("../model/productModel");
const axios = require("axios");

module.exports.intializeData = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error("Invalid data format from the third-party API.");
    }

    await Product.deleteMany();

    await Product.insertMany(response.data);

    res.status(200).json({ message: "Database initialized successfully!" });
  } catch (error) {
    console.error("Error initializing database:", error.message);
    res.status(400).json({ error: "Bad Request", details: error.message });
  }
};

module.exports.listTransactions = async (req, res) => {
  try {
    const { search = "", page = 1, perPage = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const limit = parseInt(perPage);

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { price: parseFloat(search) || 0 }, // Search by price if valid number
          ],
        }
      : {};

    const transactions = await Product.find(query).skip(skip).limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      page: parseInt(page),
      perPage: parseInt(perPage),
      total,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const regex = new RegExp(`-${month}-`, "i");

    const products = await Product.find({ dateOfSale: { $regex: regex } });

    const totalSaleAmount = products.reduce(
      (sum, product) => sum + (product.sold ? product.price : 0),
      0
    );
    const totalSoldItems = products.filter((product) => product.sold).length;
    const totalNotSoldItems = products.length - totalSoldItems;

    res.status(200).json({
      month,
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const products = await Product.find({
      dateOfSale: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const priceRanges = [
      { range: "0-100", min: 0, max: 100, count: 0 },
      { range: "101-200", min: 101, max: 200, count: 0 },
      { range: "201-300", min: 201, max: 300, count: 0 },
      { range: "301-400", min: 301, max: 400, count: 0 },
      { range: "401-500", min: 401, max: 500, count: 0 },
      { range: "501-600", min: 501, max: 600, count: 0 },
      { range: "601-700", min: 601, max: 700, count: 0 },
      { range: "701-800", min: 701, max: 800, count: 0 },
      { range: "801-900", min: 801, max: 900, count: 0 },
      { range: "901-above", min: 901, max: Infinity, count: 0 },
    ];

    products.forEach((product) => {
      const price = product.price;
      priceRanges.forEach((range) => {
        if (price >= range.min && price <= range.max) {
          range.count += 1;
        }
      });
    });

    const response = priceRanges.map((range) => ({
      range: range.range,
      count: range.count,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching bar chart data:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }

    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    const products = await Product.find({
      dateOfSale: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const categoryCounts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});

    const response = Object.entries(categoryCounts).map(
      ([category, count]) => ({
        category,
        count,
      })
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching pie chart data:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;

    const [statistics, barChart, pieChart] = await Promise.all([
      this.getStatistics(req, res),
      this.getBarChartData(req, res),
      this.getPieChartData(req, res),
    ]);

    res.status(200).json({ statistics, barChart, pieChart });
  } catch (error) {
    console.error("Error fetching combined data:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
