import {ApiHelper} from "@/api/ApiHelper";
import {OrderHistory} from "@/module/interface/OrderHistory";
import {errors} from "stripe";


export class OrderListLogic {
  private static orderListLogic: OrderListLogic;
  private apiHelper = ApiHelper.getInstance();
  private processingOrderList: OrderHistory[] = [];
  private finishedOrderList: OrderHistory[] = [];

  public static getInstance() {
    if (!this.orderListLogic) {
      this.orderListLogic = new OrderListLogic();
    }
    return this.orderListLogic;
  }

  public async fetchOrderHistory() {
      const response = await this.apiHelper.getOrderHistory();
      this.separateResponse(response)
      return response.data
  }

  private separateResponse(response: object){
    if (this.checkResState(response)) {
      // @ts-ignore
      this.processingOrderList = response.data.data.processing;
      // @ts-ignore
      this.finishedOrderList = response.data.data.finished;
    } else {
      this.processingOrderList = [];
      this.finishedOrderList = [];
    }
  }

  public getProcessingOrderList() {
    return this.processingOrderList;
  }

  public getFinishedOrderList() {
    return this.finishedOrderList;
  }

  public getOrderList(): OrderHistory[] {
    return this.processingOrderList.concat(this.finishedOrderList) as OrderHistory[];
  }

  public checkResState(res: any): boolean {
    if (res.data.status === 0) {
      alert(res.data.error);
      return false;
    } else {
      return true;
    }
  }
}
