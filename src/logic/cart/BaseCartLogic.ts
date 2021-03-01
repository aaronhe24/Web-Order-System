import {Product} from "@/module/Product";
import {Option} from "@/module/interface/Option";
import {Item} from "@/module/interface/Item";
import {toFixedX} from "@/common/filters";
import {AppHelpers} from "@/common/AppHelpers";

export class BaseCartLogic {
  // @ts-ignore
  protected products: Product[] = [];
  protected cartId: number | undefined | string;
  protected orgSubtotal: number = 0;
  protected appHelper = AppHelpers.getInstance()

  /**
   * 添加购物车(一次添加多个商品)
   * @param product
   */
   protected add(product: Product) {
    if (!product.qty) {
      return
    }
    //添加购物车带option逻辑
    if (this.hasOptions(product)) {
      this.addProductWithOption(product)
    } else {//不带选项逻辑
      this.addProductWithOutOption(product);
    }
    this.calculateOrgSubtotal();
}

  private addProductWithOption(product: Product) {
    // let filterProduct = this.optionFilter(product)
    let filterProduct = product
    var qty = filterProduct.qty
    // @ts-ignoree
    //待选项的商品在购物车中独立存在 qty != 1
    for (var i = 0; i < qty; i++) {
      const copy = filterProduct.deepCopyProduct()
      copy.qty = 1;
      this.products.push(copy)
    }
  }

  private addProductWithOutOption(product: Product) {
    const productCopy = product.deepCopyProduct();
    this.isInCart(productCopy)
      ? this.addProductQuantity(productCopy)
      : this.products.push(productCopy)
  }

  private updateProductNote(p1: Product, p2: Product){
     p1.note = p2.note
  }

  //由于计算购物车中带选线商品的个数
 private countIdenticalProductWithOptions(product: Product): number{
    let counter = 0;
    this.searchCart(p=>{
      if(this.isMatchProduct(p, product)){
        counter = counter + 1
      }
    })
    return counter
  }

  private optionFilter(product: Product){
    let options: Option[] = [];
    let items: Item[]
    product.options.map(option =>{
      let hasChecked = false;
      option.items.map(item=>{
        if(item.checked ===0){
          return;
        }
        hasChecked = true;
      })
      // option.
      hasChecked ? options.push(option) : null;
    })
    product.options = options
    return product;
  }



  /**
   * 判断是否是带选线的商品
   * @param product
   */
  private hasOptions(product: Product) {
    return product.hasOption();
  }

  /**
   *针对已添加的到购物车商品进行增加数量
   * @param product
   */
  private addProductQuantity(product: Product) {
    if (!product.qty) {
      return;
    }
    this.searchCart(p => {
      if (this.isMatchProduct(p, product)) {
        // @ts-ignore
        p.qty = p.qty + product.qty
        this.updateProductNote(p, product)
      }
    })
  }


  /**
   * 从购物车中减去数量
   * @param product
   */
  protected reduce(product: Product) {
    if (!product.qty) {
      return;
    }

    if (this.hasOptions(product)) {
      this.remove(product)
    } else {
      let deletedProduct;
      this.searchCart(p => {
        if (!this.isMatchProduct(p, product)) {
          return;
        }
        // @ts-ignore
        if (p.qty === 1) {
          deletedProduct = p
        } else {
          // @ts-ignore
          p.qty--;
        }
      })
      deletedProduct ? this.remove(product) : null;
    }
    this.calculateOrgSubtotal();
  }




  /**
   * 查看商品是否在购物车中
   * @param product
   */
  protected isInCart(product: Product) {
    var inInCart = false;
    this.searchCart(p => {
      if (this.isMatchProduct(p, product)) {
        inInCart = true;
      }
    })
    return inInCart;
  }


  /**
   * 从购物车中删除单个商品
   * @param product
   */
  protected remove(product: Product) {
    if (!this.isInCart(product)) {
      return;
    }
    if (this.hasOptions(product)) {
      this.removeProductWithOption(product);
    } else {
      this.removerProductWithoutOption(product);
    }
    this.calculateOrgSubtotal();
  }

  /**
   *
   * @param product
   */
  protected removeProductWithOption(product: Product) {
    var index = this.products.findIndex(p => {return this.matchProductWithOptionLogin(p, product)})
    this.products.splice(index, 1);
  }

  /**
   *
   * @param product
   */
  protected removerProductWithoutOption(product: Product) {
    this.products = this.products.filter(p => {return this.keepProducts(p, product)});
  }



  private keepProducts(p1: Product, p2: Product) {
    return !this.isMatchProduct(p1, p2);
  }

  private matchProductWithOptionLogin(p1: Product, p2: Product) {
    return this.isMatchOptions(p1.options, p2.options);
  }


  /**
   * 判断选线是否match
   * @param o1
   * @param o2
   */
  private isMatchOptions(o1: any, o2: any) {
    return JSON.stringify(o1) === JSON.stringify(o2);
  }


  /**
   * 遍历购物车找到商品
   * @param productId1
   * @param productId2
   */
  // protected isMatchProduct(productId1: number, productId2: number) {
  //   return productId1 === productId2
  // }

  // protected isMatchProduct(product1: Product, product2: Product) {
  //   return product1.product_id === product2.product_id && product1.is_special === product2.is_special
  // }

  protected isMatchProduct(product1: Product, product2: Product) {
    return product1.product_id === product2.product_id;
  }

  protected searchCart(callback: (any: any) => any) {
    return this.products.map(callback);
  }

  /**
   * 清空购物车
   */
  public clear() {
    this.cartId = 0;
    this.products = [];
    this.calculateOrgSubtotal();
  }

  public getCart() {
    return this.products;
  }
  public setCart(ps: Product[]){
    this.products = ps
  }

  /**
   * 新建购物车
   * @param id
   */
  protected setUp(id: any){
    this.clear()
    this.cartId = id
  }

  public calculateOrgSubtotal(){
    if(this.isCartEmpty()){
      this.orgSubtotal = 0;
      return;
    }
    this.orgSubtotal = this.searchCart(p=>{return this.calculateSubLogic(p)}).
    reduce(
      function(prev:number,cur:number){
      return prev + cur;
    },0);
  }

  public getOrgSubTotal(): number{
    return this.appHelper.roundTowDecimalNumber(this.orgSubtotal);
  }


  protected calculateSubLogic(product: Product){
    return product.calculateOrgRowTotal();
  }

  public isCartEmpty():boolean{
    return this.products.length === 0
  }

  public getCartCounter():number{
    return this.products.reduce((p, c)=>{
      return p + c.qty
    }, 0);
  }

}



