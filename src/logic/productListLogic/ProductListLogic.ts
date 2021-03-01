import {Product, ProductParam} from "@/module/Product";
import {ApiHelper} from "@/api/ApiHelper";
import {Menu, SingleMenuParams} from "@/module/interface/Menu";
import {SyncApiCart} from "@/logic/cart/SyncApiCart";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import {ShippingType} from "@/module/interface/ShippingType";
import {ShopDetail} from "@/module/interface/ShopDetail";
import {ProductResponse} from "@/module/respones/ProductResponse";
import {DeliveryType} from "@/module/enum/DeliveryType";

export class ProductListLogic {
  private apiHelper = ApiHelper.getInstance();

  private static productList: ProductListLogic;
  private shopId: number = 0;
  public menuContents: Array<Menu> = [];
  private cart: SyncApiCart = SyncApiCart.getInstance();
  private shopDetail!: ShopDetail;
  private indexId:number[] = []
  private shippingType: string =  ShippingType.DELIVERY


  public static getInstance() {
    if (!this.productList) {
      this.productList = new ProductListLogic();
    }
    return this.productList;
  }


  public setShopDetail (obj : ShopDetail): void{
      this.shopDetail = obj;
  }

  public getShopDetail (): ShopDetail{
      return this.shopDetail
  }

  public setShippingType(type: string){
    this.shippingType = type
  }

  public getShippingType(){
    return this.shippingType
  }



  public initCart() {
    this.cart = SyncApiCart.getInstance();
    let obj = {
      "shopId": this.shopId,
      "shippingType": this.shippingType,
      "shopDetail": this.shopDetail,
    }
    this.cart.setUpCart(obj);
    // this.cart.setUpCart(this.shopId, this.shippingType);
    // this.cart.setShopId(this.shopId);
    // this.cart.setShopDetail(this.shopDetail)
  }

  // public findProduct(product_id: number) : (Product | undefined)[]{
  //   return this.menuContents.map(item => {
  //     const result = item.products.find(x => x.product_id = product_id);
  //     console.log("Selected ",result)
  //     return result
  //   });
  // }

  /**
   * 添加购物车
   * @param product
   */
  public addToCart(product: Product): void {
    if (this.isCartEmpty()) {
      this.initCart();
    }
    //如果换店先清空购物车
    if(this.shopId !== this.cart.getShopId()){
      this.cart.setShopId(this.shopId)
      // this.cart.clearCart();
    }
    this.cart.addToCart(product)
  }

  private isCartEmpty(): boolean{
    return this.cart.isCartEmpty();
  }

  public reduceFromCart(product: Product): void {
    if (!this.cart) {
      this.initCart();
    }
    this.cart.reduceFromCart(product)
  }

  private async fetchCart(): Promise<void> {
    if(!this.isLogin()){
      return;
    }
    try {
      // const result = await this.apiHelper.fetchCart(this.getCartInfo())
      // const id = result.data.data.cart_id
      // const cart = this.initProducts(result.data.data.menu)
      // this.reloadCart(id, cart);
    } catch (e) {
      alert(e)
    }
  }


  private isLogin(): boolean{
    return !!GlobalSettingPreference.getInstance().getUser().token
  }

  // private reloadCart(id: String, productList: Product[]) {
  //   this.cart.reloadCart(id, productList);
  // }

  private getCartInfo(): object {
    let info = createCartInfo();
    info.product_items = JSON.stringify(this.cart.getCart())
    info.shop_id = this.shopId;
    info.address = GlobalSettingPreference.getInstance().getUser().address
    info.shipping_type = ShippingType.DELIVERY
    info.subtotal = this.cart.getSubTotal();
    return info
  }


  /**
   * 集合添加方法
   * @param product
   */
  public add(product: Product): void {

    // this.addQtyList(product);
    this.addToCart(product);
    this.fetchCart();
  }


  /**
   * 集合删减方法
   * @param product
   */
  public reduce(product: Product): void {
    this.reduceQtyList(product);
    this.reduceFromCart(product);
    this.fetchCart();
  }


  /**
   * 添加数量到列表页
   * @param product
   */
  public addQtyList(product: Product): void {
    product.qty += 1
  }

  /**
   *删除数量到列表页
   * @param product
   */
  public reduceQtyList(product: Product): void {
    if (product.qty > 0) {
      // @ts-ignore
      product.qty -= 1
    }
  }


  public setQtyList(product: Product, quantity: Number): void {
    // let product = this.findProduct(product_id)
    // @ts-ignore
    product.qty = quantity
  }

  async getShopMenu(mid: number,shipping_type:string) {
    try {
      const response = await this.apiHelper.getShopMenuCategory(mid,shipping_type)
      // console.log(JSON.stringify(response))
      return response.data.data
    } catch (e) {
      console.log(e)
    }
  }

  public getCashedShopMenu(){
    // console.log(this.indexId)
    return this.menuContents;
  }

 public async initializeMenu(mid: number,shipping_type:string) {
    // return this.isShopChanged(mid) ?
      return this.fetchProductList(mid,shipping_type)
      // : this.getCashedShopMenu();
  }

  private isShopChanged(id: number): boolean{
    return id === this.shopId;
  }

  public async fetchProductList(mid: number,shipping_type:string){
    try {
      //清空菜单数组
      const result: ProductResponse = await this.getShopMenu(mid,shipping_type);
      this.menuContents = await result.menus.map((r: SingleMenuParams) => {
        r.products = this.initProducts(r.products);
        return new Menu(r);
      });
      this.indexId = this.menuContents.map( (i,index) => index)
      // console.log(this.indexId)
      return this.menuContents;
    } catch (e) {
      console.log(e)
    }
  }

  public setShopId(id: number): void {
    this.shopId = id;
  }

  public getShopId(): number {
    if(!this.shopId){
      this.shopId = 0;
    }
    return this.shopId;
  }

  public initProducts(list: ProductParam[]): Product[] {
    let pList: Product [] = []
    //test
    // pList.push(this.testProduct)
    list.map(p => {
      let pdt = Product.initProduct(p)
      pList.push(pdt)
    })
    return pList
  }

  public getMenuIndexId(){
    return this.indexId
  }

}

function createCartInfo() {
  return {
    shop_id: 0,
    address: "",
    subtotal: 0,
    promo_codes: "",
    product_items: "",
    shipping_type: "",
  }
}
