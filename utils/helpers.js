// Generate unique order number
exports.generateOrderNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
};

// Calculate order totals
exports.calculateOrderTotals = (items, shippingFee = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const totalAmount = subtotal + shippingFee;

  return {
    subtotal,
    totalAmount,
  };
};

// Format currency
exports.formatCurrency = (amount, currency = "PKR") => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Paginate results
exports.paginate = (page = 1, limit = 20) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  return {
    skip,
    limit: parseInt(limit),
  };
};

// Build filter query
exports.buildFilterQuery = (filters) => {
  const query = {};

  if (filters.category) query.category = filters.category;
  if (filters.subcategory) query.subcategory = filters.subcategory;
  if (filters.childcategory) query.childCategory = filters.childcategory;
  if (filters.status) query.status = filters.status;
  if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
  if (filters.isActive !== undefined) query.isActive = filters.isActive;

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  return query;
};

// Build sort query
exports.buildSortQuery = (sortBy = "createdAt", order = "desc") => {
  const sortQuery = {};
  sortQuery[sortBy] = order === "asc" ? 1 : -1;
  return sortQuery;
};
