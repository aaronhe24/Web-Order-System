import {BaseCartLogic} from "@/logic/cart/BaseCartLogic";
import {Product} from "@/module/Product";
import {ApiHelper} from "@/api/ApiHelper";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";
import {GetCartParam} from "@/module/interface/GetCartParams";
import {ShopDetail} from "@/module/interface/ShopDetail";
import {ShopFullDiscount} from "@/module/interface/ShopFullDiscount";
import {getLocalStorage} from "@/common/settingTools";
import {CouponValidation, CouponValidationProduct, ValidationResult} from "@/module/interface/Coupon";
import {FullDiscountLogic} from "@/logic/discountLogic/FullDiscountLogic";



export class SyncApiCart extends BaseCartLogic {
  //服务器传下来的购物车id
  protected static cart: SyncApiCart;
  private syncCartId!: String
  private shopId = 0;
  private shopDetail!: ShopDetail;
  private apiHelper = ApiHelper.getInstance();
  private settings = GlobalSettingPreference.getInstance();
  private gift = "";
  private availableNextHit = 0;
  private nextSaleAmount = 0;
  private nextFullAmount = 0;
  private nextGift = "";
  private discount = 0;
  private perDiscount = 0;
  private productsDiscount = 0;
  private subtotal = 0;
  private shopProductSaleItems: Product[] = [];
  private shopProductSaleLimit: number = 0;
  private overLimitProductId: number[] = []; //用于外部判断是否已经限制购买
  private shippingType: string = "";
  private couponCode: string = '';

  //折扣判断逻辑
  //先判断商品折扣，再判断满


  public addToCart(product: Product) {
    product.hasSpecialOffer() && product.specialOfferEnable() ? this.addProductSaleDiscount(product) : super.add(product);
    this.addPerDiscount(product);
    this.calRealSubTotal();
  }

  /**
   * 待定使用
   * @param product
   */
  public reduceFromCart(product: Product) {
    super.reduce(product);
    product.hasSpecialOffer() && product.specialOfferEnable()? this.rmProductSaleDiscount(product) : null
    this.checkCartEmpty();
  }

  public removeProductFromCart(product: Product) {
    super.remove(product);
    product.hasSpecialOffer() && product.specialOfferEnable()? this.rmProductSaleDiscount(product) : null
    this.reducePerDiscount(product)
    this.checkCartEmpty();
  }

  public addPerDiscount(p: Product){
    if(!p.isPercentageSale()){
      return
    }
   this.perDiscount = this.appHelper.roundTowDecimalNumber(this.perDiscount + p.getDiscountPrice())
  }

  public reducePerDiscount(p:Product){
    if(!p.isPercentageSale()){
      return
    }
    this.perDiscount = this.perDiscount - p.getDiscountPrice();
    this.perDiscount = this.perDiscount <=0 ? 0 : this.appHelper.roundTowDecimalNumber(this.perDiscount);
  }

  private checkCartEmpty() {
    if (!super.isCartEmpty()) {
      this.calRealSubTotal();
      return;
    }
    this.clearCart();
  }

  public isInLimitList(product: Product): boolean {
    return this.overLimitProductId.includes(product.product_id);
  }

  private removeFromLimitList(product: Product) {
    if (!this.isInLimitList(product)) {
      return
    }
    let index = this.overLimitProductId.indexOf(product.product_id);
    this.overLimitProductId.slice(index, index + 1);
  }

  private addToLimitList(product: Product) {
    if (this.isInLimitList(product)) {
      return
    }
    this.overLimitProductId.push(product.product_id);
  }


  private calRealSubTotal() {
    // this.discount = this.checkShopFullDiscount(this.appHelper.roundTowDecimalNumber(
    //   this.orgSubtotal - this.productsDiscount - this.perDiscount));
    const disObj = FullDiscountLogic.getInstance().checkShopFullDiscount(this.appHelper.roundTowDecimalNumber(
      // @ts-ignore
      this.orgSubtotal - this.productsDiscount - this.perDiscount), this.shopDetail)
    this.discount = disObj.discount
    this.setFullDiscountParams(disObj)
    this.subtotal = this.appHelper.roundTowDecimalNumber(this.orgSubtotal - this.discount - this.productsDiscount - this.perDiscount);
    this.subtotal = this.subtotal > 0 ? this.subtotal : 0;
    this.availableNextHit = this.appHelper.roundTowDecimalNumber(this.nextFullAmount - this.subtotal);
    this.setCartSession();
  }

  private setFullDiscountParams(obj: object){
    // @ts-ignore
    this.nextSaleAmount = obj.nextSaleAmount
    // @ts-ignore
    this.nextFullAmount = obj.nextFullAmount
    // @ts-ignore
    this.nextGift = obj.nextGift
    // @ts-ignore
    this.gift = obj.gift

  }

  public static getInstance() {
    if (!this.cart) {
      this.cart = this.getCartSession(new SyncApiCart(), this.parseCartSession(getLocalStorage().sessionCart));
    }
    return this.cart;
  }

  private static getCartSession(c1: SyncApiCart, copy: SyncApiCart) {
    if (!copy || !copy.products) {
      return c1;
    }
    c1.products = copy.products;
    c1.shopId = copy.shopId;
    c1.gift = copy.gift;
    c1.syncCartId = copy.syncCartId;
    c1.shopId = copy.shopId;
    c1.shopDetail = copy.shopDetail;
    c1.gift = copy.gift
    c1.availableNextHit = copy.availableNextHit
    c1.nextSaleAmount = copy.nextSaleAmount
    c1.nextFullAmount = copy.nextFullAmount
    c1.nextGift = copy.nextGift;
    c1.discount = copy.discount;
    c1.productsDiscount = copy.productsDiscount;
    c1.subtotal = copy.subtotal;
    c1.shopProductSaleItems = copy.shopProductSaleItems;
    c1.shopProductSaleLimit = copy.shopProductSaleLimit;
    c1.overLimitProductId = copy.overLimitProductId;
    c1.shippingType = copy.shippingType
    c1.perDiscount = copy.perDiscount;
    c1.orgSubtotal = copy.orgSubtotal;
    return c1
  }

  private static parseCartSession(string: any) {
    if (!string) {
      return null;
    }
    let s = JSON.parse(string);
    s.products = this.renewProducts(s.products)
    s.shopProductSaleItems = this.renewProducts(s.shopProductSaleItems)
    return s
  }

  private static renewProducts(pList: Product[]) {
    if (!pList) {
      return;
    }
    return pList.map(p => Product.initProduct(p))
  }

  public setUpCart(obj: any) {
    //如果页面刷新，不重新载入购物车
    if (this.shopId === obj.id && !this.isShippingTypeChange(obj.shippingType)) {
      return;
    }
    this.clearCart();
    this.setDeliveryType(obj.shippingType);

    this.setShopId(obj.shopId)
    this.setShopDetail(obj.shopDetail)
    super.setUp(obj.shopId)
  }

  public isShopChanged(id: number): boolean {

    return this.shopId !== 0 && this.shopId !== id
  }

  public isShippingTypeChange(shippingType: string): boolean {
    return this.shippingType !== shippingType
  }


  public async reloadCart(id: String, productList: Product[]) {
    this.setSyncCartId(id);
    await this.syncProductsData(productList)

    this.calculateOrgSubtotal();
    this.calRealSubTotal();

  }


  private isMatchFromCloudCart(p1: Product, p2: Product) {
    return p1.product_id === p2.product_id;
  }

  private syncProductsData(ps2: Product[]) {
    this.products.map(p => {
      let pc = ps2[this.products.indexOf(p)];
      if (this.isMatchFromCloudCart(p, pc)) {
        p.row_total = pc.row_total;
        p.org_row_total = pc.org_row_total;
      }
    })
  }

  public setCart(productList: Product[]) {
    this.products = productList;
  }

  public setSyncCartId(id: String): void {
    this.syncCartId = id;
  }


  public getSyncCartId(): String {
    return this.syncCartId;
  }

  public setShopDetail(info: ShopDetail) {
    //保护下单的商户信息，防止进入新店，没有清空购物车缺写入信息
    // if (info.mid !== this.shopId) {
    //   return;
    // }
    this.shopDetail = info;
    this.hasShopProductSale() ? this.setProductSaleLimit(
      // @ts-ignore
      this.shopDetail.data.discount_events?.shop_product_sale[0].options.order_limit_times
    ) : null
  }

  private setProductSaleLimit(limit: number) {
    this.shopProductSaleLimit = limit;
  }

  public getShopDetail(): ShopDetail {
    return this.shopDetail;
  }

  public setShopId(id: number) {
    this.shopId = id;
  }

  public getShopId(): number {
    return this.shopId;
  }

  private initProductList(data: any[]): Product[] {
    return data.map(d => {
      const p = Product.initProduct(d)
      return p
    })
  }

  public async fetchCart(cartInfo: GetCartParam): Promise<any> {
    if (!this.settings.isLogin()) {
      return;
    }
    cartInfo.product_items = JSON.stringify(this.getCart())
    cartInfo.subtotal = this.getSubTotal();
    cartInfo.shop_id = this.shopId;

    const result = await this.apiHelper.fetchCart(cartInfo)
    if (result.data.data.cart_id) {
      const id = result.data.data.cart_id
      this.reloadCart(id, this.initProductList(result.data.data.menu));
    }
    return result.data

  }



  ///////Delete later
  //满减逻辑
  // public hasShopFullDiscount(): boolean {
  //   // @ts-ignore
  //
  //   return this.shopDetail && this.getShopDetail().data && this.getShopDetail().data.discount_events
  //     // @ts-ignore
  //     && this.getShopDetail().data.discount_events.shop_full_discount
  //     // @ts-ignore
  //     && this.getShopDetail().data.discount_events.shop_full_discount.length > 0;
  // }


  // public fullDiscountEnable(obj: ShopFullDiscount): boolean {
  //   if (!this.hasShopFullDiscount()) {
  //     return false;
  //   }
  //   return obj.enabled === 1;
  // }
  //
  // public checkShopFullDiscount(subTotal: number): number {
  //   let discount = 0;
  //   subTotal = subTotal * 100
  //   if (!this.hasShopFullDiscount()) {
  //     return discount;
  //   }
  //   let that = this
  //   // @ts-ignore
  //   let fullDiscount = this.getShopDetail().data.discount_events.shop_full_discount;
  //   // let copy = fullDiscount
  //   // @ts-ignore
  //   fullDiscount = this.sortFullDiscount(fullDiscount);
  //   // @ts-ignore
  //   fullDiscount = fullDiscount.filter(f => that.fullDiscountEnable(f)); //取出开关没有打开的
  //   // @ts-ignore
  //   let discountOptions = fullDiscount.map(f => f.options)
  //   // @ts-ignore
  //   let discounts = fullDiscount.map(f => f.discount_amount);
  //   let fullAmounts = discountOptions.map(d => d.full_amount * 100);
  //   let gifts = discountOptions.map(d => d.gift_product);
  //   let hits = fullAmounts.map(f => subTotal >= f)
  //   //取最后一个返回值为true的index
  //   let index = hits.indexOf(false);
  //
  //
  //   const isLast = index === -1;
  //   const objParams = {
  //     "discounts": discounts,
  //     "gifts": gifts,
  //     "fullAmounts": fullAmounts,
  //     "subtotal": subTotal,
  //   }
  //   return isLast ? this.onHitDiscount(objParams, discounts.length - 1)
  //     : (index ? this.onHitDiscount(objParams, index - 1)
  //       : this.onHitDiscount(objParams, -1));
  // }


  // private onHitDiscount(obj: object, index: number): number {
  //   // @ts-ignore
  //   this.gift = obj.gifts[index];
  //   // @ts-ignore
  //   const stillHasDiscount = index < obj.fullAmounts.length - 1
  //
  //   if (stillHasDiscount) {
  //     // @ts-ignore
  //     this.nextSaleAmount = this.appHelper.roundTowDecimalNumber(obj.discounts[index + 1])
  //     // @ts-ignore
  //     this.nextFullAmount = obj.fullAmounts[index + 1] / 100;
  //     // @ts-ignore
  //     this.nextGift = obj.gifts[index + 1]
  //   } else {
  //     this.nextSaleAmount = 0;
  //     this.availableNextHit = 0;
  //     this.nextGift = ''
  //   }
  //   // @ts-ignore
  //   return index === -1 ? 0 : obj.discounts[index];
  // }

  // private sortFullDiscount(discount: ShopFullDiscount[]) {
  //   return discount.sort((a, b) => {
  //     return a.options.full_amount - b.options.full_amount
  //   })
  // }

  ///////Delete later

  //打折商品逻辑
  private hasShopProductSale(): boolean {
    // @ts-ignore
    return this.getShopDetail().data.discount_events && this.getShopDetail().data.discount_events.shop_product_sale
  }

  // private

  //查看是否有商品折扣
  private addProductSaleDiscount(product: Product) {
    this.copyMultipleTimesProductsByQty(product)
    this.productsDiscount = this.calProductDiscountPrice();
  }

  private calProductDiscountPrice() {
    return this.shopProductSaleItems.reduce((p, c) => {
      c.dis_qty = 1;
      return p + c.getDiscountPrice()
    }, 0)
  }


  private copyMultipleTimesProductsByQty(product: Product) {
    let times = product.qty;
    for (var i = 0; i < times; i++) {
      const copy = product.deepCopyProduct()
      let del;
      copy.qty = 1;
      copy.dis_qty = 0;
      //先判断商品限购数量，再判断商品组限购数量
      if (this.isOverSpecialLimit(product)) {
        this.addToLimitList(product)
      } else {
        this.removeFromLimitList(product);
        //先添加进购物车和打折商品列表
        this.shopProductSaleItems.push(copy)
        //如果超过了限制，找到打折力度最大的，从打折列表和购物车中移除，恢复原价
        if (this.isOverSpecialGroupLimit()) {
          this.sortProductsSale();
          del = this.removeFromProductSale()
        }
      }
      let disQty = this.getDiscountProductQty(product);
      this.setProductDisQty(copy, disQty, del);
    }
  }

  private getDiscountProductQty(product: Product): number {

    return this.shopProductSaleItems.reduce((p, c) => {
      if (this.isMatchFromCloudCart(c, product)) {
        p = p + c.qty
      }
      return p;
    }, 0)
  }

  isOverSpecialLimit(product: Product): boolean {
    if(product.discount_limit_times ===0 ){
      return false
    }
    if (!super.isInCart(product)) {
      return false;
    }
    let cartProduct: Product[];
    let limit = product.discount_limit_times
    let qty = 0;
    cartProduct = super.searchCart((p) => {
      if (!super.isMatchProduct(product, p)) {
        return;
      }
      return p;
    })
    cartProduct.map(c => {
      if (!c) {
        return
      }
      qty = qty + c.qty
    })
    return limit <= qty
  }


  private rmProductSaleDiscount(product: Product) {
    this.removeFromProductSaleList(product)
    this.addProductBack();
    this.productsDiscount = this.calProductDiscountPrice()
  }

  private removeFromProductSaleList(p: Product) {
    this.shopProductSaleItems = this.shopProductSaleItems.filter(s => {
      return !super.isMatchProduct(s, p)
    })
  }

  private addProductBack() {
    // 筛选出打折菜品
    let sp = this.getCart().filter(p => {
      //打折商品，而且是需要限购的打折商品
      return p.hasSpecialOffer() && p.specialOfferEnable();
    })
    //不打折的菜先加入购物车
    super.setCart(this.getCart().filter(p => {
      //没有开启商品限购的打折商品
      return !p.specialOfferEnable() ;
    }))

    //重新添加打折菜品并计算
    sp.map(p => {
      this.rmProductSaleDiscount(p)
      this.addToCart(p)
    })

  }

  /**
   * 负数代表没有超过限制，正数表示超过了限制
   */
  private isOverSpecialGroupLimit() {
    if (this.shopProductSaleLimit <= 0) {
      return false
    }
    let qty = this.shopProductSaleItems.length
    return qty - this.shopProductSaleLimit > 0;
  }

  private sortProductsSale(): Product[] {
    //从小到大按价格排列
    return this.shopProductSaleItems.sort((a, b) => {
      return a.getDiscountAmountPerProduct() - b.getDiscountAmountPerProduct()
    })
  }

  private removeFromProductSale(): Product {
    //单价打折最多的商品
    let length = this.shopProductSaleItems.length
    let item = this.shopProductSaleItems[length - 1];
    this.shopProductSaleItems = this.shopProductSaleItems.slice(0, length - 1)
    return item;
  }

  private setProductToOrgPrice(product: Product) {
    //先减去一个， 再加上一个原价
    // super.reduce(product);
    product.deepCopyProduct();
    product.is_special = 0;
    product.qty = 1;
    product.price = product.org_price;
    super.add(product)
  }

  private setProductDisQty(product: Product, disQty: number, del?: Product) {
    super.add(product)
    this.setDiscountProductToOrgPrice(product, del);
    this.setDiscountProductToDiscountPrice(product, disQty)
  }

  private setDiscountProductToDiscountPrice(product: Product, disQty: number) {
    if (product.hasOption()) {
      //带有选项的
      let ps = this.products.filter(p => {
        return this.isMatchFromCloudCart(p, product)
      })
      ps.length > 0 ? ps.map(p => {
        if (ps.indexOf(p) < disQty) {
          p.dis_qty = 1;
        }
      }) : null
      return
    }
    //不带有选项的
    super.searchCart(p => {
      if (this.isMatchFromCloudCart(p, product)) {
        p.dis_qty = disQty;
      }
    })
  }

  private setDiscountProductToOrgPrice(product: Product, del?: Product) {
    //带有选项的菜被挤出
    if (!del || del.product_id === product.product_id) {
      return
    }
    if (del.hasOption()) {
      let ps = this.products.filter(p => {
        return this.isMatchFromCloudCart(p, del)
      })
      ps[0].dis_qty = 0
      return;
    }
    let ps = this.products.filter(p => {
      return this.isMatchFromCloudCart(p, del)
    })
    ps[0].dis_qty = ps[0].dis_qty - 1
  }

  public getDeliveryType(): string {
    return this.shippingType
  }

  public setDeliveryType(type: string) {
    this.shippingType = type;
  }


  public getShopFullAmountGifts(): string {
    return this.gift
  }

  public setShopFullAmountGifts(g: string) {
    this.gift = g;
  }

  //下个满送
  public getNextAvailableGifts(): string {
    return this.nextGift;
  }

  //下个折扣的具体折扣价值
  public getNextSaleAmount(): number {
    return this.nextSaleAmount
  }

  //距离下个折扣还差多少钱
  public getAvailableNextHit(): number {
    return this.availableNextHit
  }

  public getSubTotal(): number {
    return this.subtotal;
  }

  public hasDiscount(): boolean {
    return this.discount + this.productsDiscount + this.perDiscount> 0;
  }

  public getLimitList(): number[] {
    return this.overLimitProductId;
  }

  //最低成单金额
  public getOrderMinSubtotal(): number {
    if (!this.shopDetail) {
      return 0
    }
    return this.shopDetail.min_amount;
  }


  public enableCheckout(): boolean {
    return this.getCartCounter() > 0
      && this.getSubTotal() - this.getOrderMinSubtotal() >= 0;
  }

  public clearCart() {
    super.clear();
    this.nextSaleAmount = 0;
    this.nextFullAmount = 0;
    this.availableNextHit = 0;
    this.gift = ""
    this.nextGift = ""
    this.discount = 0;
    this.productsDiscount = 0;
    this.shopProductSaleItems = []
    this.shopProductSaleLimit = 0;
    this.shopProductSaleItems = [];
    this.shopProductSaleLimit = 0;
    this.overLimitProductId = [];
    this.subtotal = 0;
    this.shippingType = "";
    this.shopId = 0;
    this.couponCode = "";
    this.perDiscount = 0;
    window.localStorage.removeItem('shopping_cart')
  }

  private setCartSession() {
    window.localStorage.setItem('shopping_cart', JSON.stringify(SyncApiCart.getCartSession(new SyncApiCart(), this)));
  }


  public getCouponValidationProducts(): CouponValidationProduct[] {
    const products = this.getCart();
    return products.map((product) => {
      const couponValidationProduct: CouponValidationProduct = {
        product_id: product.product_id,
        options: product.options,
        note: product.note,
        qty: product.qty,
        row_total: product.row_total
      }
      return couponValidationProduct
    });
  }

  public async validateCoupon(code: string){
      const couponValidation: CouponValidation = {
        shop_id: this.getShopId(),
        auto_match: 1,
        product_items: JSON.stringify(this.getCouponValidationProducts()),
        shipping_type: this.getDeliveryType(),
        subtotal: this.getSubTotal(),
        promo_codes: code,
      }
      const response = await this.apiHelper.validateCoupon(this.getCouponStr(couponValidation));
      return response.data

  }



  getCouponStr(coupon: CouponValidation): string {
    const paramsArr = [];
    for (const key in coupon) {
      paramsArr.push(key + '=' + coupon[key].toString())
    }
    return paramsArr.join('&');
  }

  public setCouponCode(code: string) {
    this.couponCode = code;
  }

  public getCouponCode(): string {
    return this.couponCode;
  }


  //检查是否支持自取
  public checkEnablePickup() {
    return this.getShopDetail().customer_pickup
  }

  public inCartDisNumber(id: number): number {
    const counter = this.shopProductSaleItems.reduce((p, c) => {
      if (c.product_id === id) {
        p = p + c.dis_qty
      }
      return p;
    }, 0)
    return counter
  }

}


