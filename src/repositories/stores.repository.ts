import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {InventoryDataSource} from '../datasources';
import {Categories, CategoryRelations} from '../models/categories.model';
import {Products} from '../models/products.model';
import {Stores, StoresRelations} from '../models/stores.model';
import {CategoriesRepository} from './categories.repository';
import {ProductsRepository} from './products.repository';

export class StoresRepository extends DefaultCrudRepository<
  Stores,
  typeof Stores.prototype.id,
  StoresRelations
> {

  public readonly products: HasManyRepositoryFactory<Products, typeof Stores.prototype.id>;
  constructor(
    @inject('datasources.inventory') dataSource: InventoryDataSource,
    @repository.getter('ProductsRepository') protected productsRepository: Getter<ProductsRepository>,
    @repository(CategoriesRepository) protected categoriesRepo: CategoriesRepository,
  ) {
    super(Stores, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productsRepository,
    )

    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }

  async findByIdAndEnabledCategories(id: string, limit: number, skip: number): Promise<(Products)[]> {

    const products = await this.products(id).find({limit, skip});

    const categoriesUsed = new Map()
    const filteredProducts: Products[] = []

    const checkToAddProduct = (prd: Products, cat: (Categories & CategoryRelations) | null) => {
      if (cat?.enabled) {
        filteredProducts.push(prd)
      }
    }

    for (const prd of products) {
      const currCat = categoriesUsed.get(prd.categoriesId)
      if (currCat === undefined) {
        const cat = await this.categoriesRepo.findOne({where: {id: prd.categoriesId}})
        categoriesUsed.set(prd.categoriesId, cat)
        checkToAddProduct(prd, cat)
      }
      else {
        checkToAddProduct(prd, currCat)
      }
    }

    return filteredProducts
  }


}
