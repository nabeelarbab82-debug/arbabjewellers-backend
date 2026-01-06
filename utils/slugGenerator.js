// Generate slug from string
exports.generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

// Generate unique slug by appending number if exists
exports.generateUniqueSlug = async (Model, text, excludeId = null) => {
  let slug = this.generateSlug(text);
  let count = 0;
  let uniqueSlug = slug;

  while (true) {
    const query = { slug: uniqueSlug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Model.findOne(query);
    if (!existing) {
      break;
    }

    count++;
    uniqueSlug = `${slug}-${count}`;
  }

  return uniqueSlug;
};
