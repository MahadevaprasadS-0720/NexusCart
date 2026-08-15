const { initialCategories } = require('../data/mockData');

let categoriesStore = [...initialCategories];

class CategoryModel {
  static async findAll() {
    return categoriesStore;
  }

  static async create(categoryData) {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: categoryData.name,
      slug: categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: categoryData.icon || 'Tag'
    };
    categoriesStore.push(newCat);
    return newCat;
  }
}

module.exports = CategoryModel;
