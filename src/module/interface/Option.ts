import {Item} from "@/module/interface/Item";

export interface OptionParam {
  label: string;
  type: string;
  status: number;
  items: Item[];
  min: number;
  max: number;
}


export class Option{
  label: string = "";
  type: string ="";
  status: number = 0;
  items: Item[] = [];
  min: number = 0;
  max: number = 0;
  rowTotal: number = 0;

  public static initOption(obj: OptionParam){
    let opt = new Option();
    opt.label = obj.label;
    opt.type = obj.type;
    opt.items = this.initItems(obj.items);
    opt.max = obj.max;
    opt.min = obj.min;
    return opt
  }

  private static initItems(items: Item[]): Item[]{
   return items.map(i=>{
      return Item.initialItem(i);
    })
  }

  public optionToString(): String{
    if(!this.hasItems()){
      return '';
    }
    let prefix = this.label + ": "
    let s = prefix + this.items.map(i=>{
      if(i.checked === 0){
        return;
      }
      return  i.name + " * " + i.qty
    }).join(" ")
    return s === prefix ? "" : s;
  }

  public hasItems():boolean{
    return this.items.length > 0;
  }

  public getOptionRowTotal(): number{
     return this.items.reduce((p, c)=>{
       return  p + c.getItemRowTotal()
    }, 0)
  }

  public getOptionOrgRowTotal(): number{
    return  this.items.reduce((p, c)=>{
      return  p + c.getItemOrgRowTotal()
    },0)
  }


}

export enum OptionType {
  CheckBox = "checkbox",
  Radio = "radio",

}
