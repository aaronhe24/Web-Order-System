export enum OrderStatus {
  STATUS_NEW        = 0,
  STATUS_PAYPENDING = 1,
  STATUS_CONFIRMED  = 10,
  STATUS_ASSIGN     = 11,       //已经分配了送货员
  STATUS_PICKED     = 12,
  STATUS_ROGER      = 15,       //送货员确认收到了分配的任务
  STATUS_DELIVERED  = 16,        //司机已送达
  STATUS_FINISHED   = 20,
  STATUS_CANCEL     = -1,       //订单已取消
  STATUS_MALICIOUS  = -9,       //恶意订单
  STATUS_PREORDER   = -20       //预订单

}

// STATUS_NEW          : 0,        //新订单
// STATUS_PAYPENDING   : 1,        //等待付款
// STATUS_CONFIRM      : 10,       //订单已确认
// STATUS_ASSIGN       : 11,       //已经分配了送货员
// STATUS_ROGER        : 15,       //送货员确认收到了分配的任务
// STATUS_PICKED       : 12,       //送货员已取货
// STATUS_DELIVERED    : 16,        //司机已送达
// STATUS_FINISHED     : 20,       //订单已完成
// STATUS_CANCEL       : -1,       //订单已取消
// STATUS_MALICIOUS    : -9,       //恶意订单
// STATUS_PREORDER     : -20,       //预订单
// STATUS_PIN          : -30,      //拼单
