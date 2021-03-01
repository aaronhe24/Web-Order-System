import {PaymentStatus} from "@/module/enum/PaymentStatus";
import {OrderStatus} from "@/module/enum/OrderStatus";
import {ApiHelper} from "@/api/ApiHelper";
import {getNewOrderDetail, OrderDetail} from "@/module/interface/OrderDetail";


export class OrderDetailLogic {

  private static orderDetailLogic: OrderDetailLogic;
  private apiHelper = ApiHelper.getInstance();
  private order: OrderDetail = getNewOrderDetail();

  public static getInstance() {
    if (!this.orderDetailLogic) {
      this.orderDetailLogic = new OrderDetailLogic();
    }
    return this.orderDetailLogic;
  }

  getPaymentStatusIdx(status: number) {
    if (PaymentStatus.PAYMENT_STATUS_TIMEOUT <= status && status < PaymentStatus.PAYMENT_STATUS_UPAPAID) return 0;
    else if (PaymentStatus.PAYMENT_STATUS_UPAPAID <= status && status < PaymentStatus.PAYMENT_STATUS_PREPAID) return 1;
    else if (PaymentStatus.PAYMENT_STATUS_PREPAID <= status && status < PaymentStatus.PAYMENT_STATUS_PAID) return 2;
    else if (PaymentStatus.PAYMENT_STATUS_PAID <= status && status < PaymentStatus.PAYMENT_STATUS_REFUND) return 3;
    else if (PaymentStatus.PAYMENT_STATUS_REFUND <= status && status < PaymentStatus.PAYMENT_STATUS_FAILED) return 4;
    else if (PaymentStatus.PAYMENT_STATUS_FAILED <= status && status < PaymentStatus.PAYMENT_STATUS_WAITING_ADJUST) return 5;
    else if (PaymentStatus.PAYMENT_STATUS_WAITING_ADJUST <= status) return 6;
    else return -1;
  }

  getOrderStatusIdx(status: number) {
    if (OrderStatus.STATUS_NEW == status) return 0;
    else if (OrderStatus.STATUS_CONFIRMED == status || status == OrderStatus.STATUS_ASSIGN || status == OrderStatus.STATUS_ROGER) return 1;
    else if (OrderStatus.STATUS_PICKED == status || status == OrderStatus.STATUS_DELIVERED) return 2;
    else if (OrderStatus.STATUS_FINISHED == status) return 3;
    else if (OrderStatus.STATUS_PAYPENDING === status) return 4;
    else return -1;
  }

  public async fetchOrderDetail(orderId: number) {
    try {
      const response = await this.apiHelper.getOrderDetail(orderId);
      this.order = response.data.data;
      return response.data
    } catch (e) {
      console.log(e);
      return this.apiHelper.getErrorMessage(e)
    }
  }

  public getOrder(): OrderDetail {
    return this.order;
  }

  public checkResState(res: any): boolean {
    if (res.data.status === 0) {
      alert(res.data.error);
      return false;
    } else {
      return true;
    }
  }

  public async sendReceipt(order_id:number,email:string){
    try {
      const response = await this.apiHelper.sendReceiptRequest(order_id,email);
      return response.data.status
    }catch (e) {
      console.log(e);
      return this.apiHelper.getErrorMessage(e)
    }
  }

}
