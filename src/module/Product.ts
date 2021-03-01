import {Option} from "@/module/interface/Option";
import {Item} from "@/module/interface/Item";

export interface ProductParam {
  product_id: number;
  product_name: string;
  product_image: string;
  product_desc: string;
  price: number;
  org_price: number;
  options: Option[];
  is_special: number;
  position: number;
  max: number;
  stock: number;
  discount: number;
  discount_price: number;
  discount_limit_times: number;
  qty:number;
  row_total?: number;
  org_row_total?: number;
  tags?: Tags[];
  note?: string;
  dis_qty?: number;

}

export interface Tags {
  tag: string;
  color: string;
}

export class Tags {
  public tag = ""
  public color =  "#"
}

export class Product {
  discount: number = 0;
  discount_limit_times = 0;
  discount_price: number = 0;
  max: number = 0;
  options: Option[] = [];
  org_price: number = 0;
  position: number = 0;
  price: number = 0;
  is_special: number = 0;
  product_desc: string = "";
  product_id: number = 0;
  product_image: string = "";
  product_name: string = "";
  qty: number = 0;
  row_total: number = 0;
  stock: number = 0;
  org_row_total: number = 0;
  tags: Tags[] = [];
  note = "";
  dis_qty = 0;



  public static initProduct(obj: ProductParam): Product{
    var p = new Product()
       p.discount = obj.discount;
       p.discount_limit_times = obj.discount_limit_times;
       p.discount_price = obj.discount_price;
       p.max = obj.max;
       p.options = this.initOptions(obj.options);
       p.org_price = obj.org_price;
       p.position = obj.position;
       p.price = obj.price;
       p.is_special = obj.is_special;
       p.product_desc = obj.product_desc;
       p.product_id = obj.product_id;
       p.product_image = obj.product_image;
       p.product_name = obj.product_name;
       p.qty = obj.qty ? obj.qty : 0;
       p.row_total = obj.row_total ? obj.row_total : 0;
       p.org_row_total = obj.org_row_total ? obj.org_row_total : 0;
       p.stock = obj.stock;
       p.tags = obj.tags ? obj.tags : p.tags;
       p.note = obj.note ? obj.note : p.note;
       p.dis_qty = obj.dis_qty ? obj.dis_qty : 0;
       return p
  }

  public productToString(): String{
    if(!this.hasOption()){
      return "";
    }
    let s = this.options.map(o=>
      o.optionToString()
    ).join(" + ")
    return s;
  }

  public hasOption():boolean{
    return this.options.length > 0;
  }

  public getOrgPriceQty(): number{
    return this.qty - this.dis_qty;
  }


  public calculateRowTotal(): number {
    return  this.hasOption() ?
      this.calculateRowTotalWithOptions()
      :this.calculateRowTotalWithoutOptions()
  }

  private calculateRowTotalWithOptions(){
    if(this.specialOfferEnable()){
      return Math.round( this.getOrgPriceQty() * (this.org_price + this.getOptionsRowTotal())* 100
        + this.dis_qty * (this.price + this.getOptionsRowTotal())* 100)/100
    }else {
      return Math.round( this.qty * (this.price + this.getOptionsRowTotal())* 100)/100
    }

  }

  private calculateRowTotalWithoutOptions(){
    if(this.specialOfferEnable()){
      return Math.round( this.getOrgPriceQty() * this.org_price * 100 + this.dis_qty * this.price *100)/100
    }else {
      return Math.round( this.qty * this.price * 100)/100
    }

  }

  public calculateOrgRowTotal(): number {
  return  this.hasOption() ?
      Math.round(this.qty * (this.org_price + this.getOptionsOrgRowTotal())* 100)/100
      :Math.round( this.qty * this.org_price * 100)/100
  }

  public getOptionsRowTotal(): number{
    return  this.options.reduce((p, c)=>{
      return  p + c.getOptionRowTotal()
    }, 0)
  }

  public getOptionsOrgRowTotal(): number{
    return this.options.reduce((p, c)=>{
      return  p + c.getOptionOrgRowTotal()
    }, 0)
  }

  public getDiscountPrice(): number{
    return this.calculateOrgRowTotal() - this.calculateRowTotal();
  }

  public getDiscountAmountPerProduct(): number{
    return this.org_price - this.price;
  }

  public hasSpecialOffer():boolean{
   return this.getDiscountAmountPerProduct() > 0;
  }

  public specialOfferEnable(): boolean{
    return this.is_special === 1;
  }

  public isShowDiscount():boolean{
    if(this.row_total && this.org_row_total){
      return this.row_total !== this.org_row_total;
    }else {
      return this.calculateRowTotal() !== this.calculateOrgRowTotal();
    }

  }

  public isPercentageSale(){
    return !this.specialOfferEnable() && this.hasSpecialOffer()
  }
  public isOutOfStock(){
    return this.stock === 0;
  }




  /**
   * 深拷贝一份商品副本
   * @param product
   */
  public deepCopyProduct(): Product{
    let copy = JSON.parse(JSON.stringify(this))
    return Product.initProduct(copy);
  }

  private static initOptions(options: Option[]) {
   return  options.map(o=>{
      return  Option.initOption(o);;
    })
  }
}






