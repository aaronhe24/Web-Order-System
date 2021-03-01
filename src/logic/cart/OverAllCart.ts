import {BaseCartLogic} from "@/logic/cart/BaseCartLogic";

export class OverAllCart extends BaseCartLogic{
  private userId: number | undefined;

  public clear(){
    this.userId = 0;
  }


}
