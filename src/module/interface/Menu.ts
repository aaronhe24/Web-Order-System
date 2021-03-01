import {Product} from "@/module/Product";

export interface SingleMenuParams {
  category: string;
  products: Product[];
}

export class  Menu {

  category: string;
  products: Product[];

  constructor(params: SingleMenuParams) {
    this.category = params.category;
    this.products = params.products;
  }

}
