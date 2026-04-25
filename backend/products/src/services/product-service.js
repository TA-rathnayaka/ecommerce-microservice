// product-service.js
import { ProductRepository } from '../database/index.js';
import { FormateData } from '../utils/index.js';
import { APIError, NotFoundError, BadRequestError } from '../utils/app-errors.js';

class ProductService {

  constructor() {
    this.repository = new ProductRepository();
  }

  async CreateProduct(productInputs) {
    try {
      const productResult = await this.repository.CreateProduct(productInputs);
      return FormateData(productResult);
    } catch (err) {
      throw new APIError('Could not create product', 500, err.message);
    }
  }

  async GetProducts() {
    try {
      const products = await this.repository.Products();
      const categories = Object.keys(
        products.reduce((acc, { type }) => ({ ...acc, [type]: true }), {})
      );
      
      const categoryCounts = products.reduce((acc, { type }) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      categoryCounts.all = products.length;

      return FormateData({ products, categories, categoryCounts });
    } catch (err) {
      throw new APIError('Could not fetch products', 500, err.message);
    }
  }

  async GetProductDescription(productId) {
    try {
      const product = await this.repository.FindById(productId);
      if (!product) throw new NotFoundError(`Product with id ${productId} not found`);
      // fixed: was relying on FormateData to throw a generic Error
      // now throws a proper NotFoundError with a 404 status code
      return FormateData(product);
    } catch (err) {
      if (err instanceof NotFoundError) throw err; // re-throw known errors as-is
      throw new APIError('Could not fetch product', 500, err.message);
    }
  }

  async GetProductsByCategory(category) {
    try {
      const products = await this.repository.FindByCategory(category);
      if (!products || products.length === 0) {
        throw new NotFoundError(`No products found for category: ${category}`);
      }
      return FormateData(products);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new APIError('Could not fetch products by category', 500, err.message);
    }
  }

  async GetSelectedProducts(selectedIds) {
    try {
      if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
        throw new BadRequestError('selectedIds must be a non-empty array');
      }
      const products = await this.repository.FindSelectedProducts(selectedIds);
      return FormateData(products);
    } catch (err) {
      if (err instanceof BadRequestError) throw err;
      throw new APIError('Could not fetch selected products', 500, err.message);
    }
  }

  async GetProductPayload(userId, { productId, qty }, event) {
    try {
      const product = await this.repository.FindById(productId);
      if (!product) throw new NotFoundError(`Product with id ${productId} not found`);

      const payload = {
        event,
        data: { userId, product, qty }
      };

      return FormateData(payload);
    } catch (err) {
      if (err instanceof NotFoundError) throw err;
      throw new APIError('Could not build product payload', 500, err.message);
    }
  }
}

export default ProductService;