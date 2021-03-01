
export interface ItemParam {
  name: string;
  price: number;
  org_price: number;
  checked: number;
  max: number;
  status: number;
  qty?: number;
}


export class Item{
  name: string = "";
  price: number = 0;
  org_price: number = 0;
  checked: number = 0;
  max: number = 0;
  status: number = 1;
  qty: number = 0;

  public static initialItem(params: ItemParam) {
    let item = new Item();
    item.name = params.name;
    item.price = params.price;
    item.org_price = params.org_price ? params.org_price : params.price;
    item.checked = params.checked;
    item.max = params.max;
    item.status = params.status;
    item.qty = params.qty ? params.qty : 0
    return item
  }

  public hasDiscount():boolean{
    return this.price < this.org_price;
  }

  public isChecked(): boolean{
    return this.checked === 1;
  }

  public getItemRowTotal(): number{
    return this.qty * this.price
  }

  public getItemOrgRowTotal(): number{
    return this.qty * this.org_price
  }

  public isOutOfStock(){
    return this.status === 0;
  }



}
