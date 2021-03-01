export enum PaymentStatus {
  PAYMENT_STATUS_TIMEOUT = -1,
  PAYMENT_STATUS_UPAPAID  = 0,
  PAYMENT_STATUS_PREPAID  = 10,
  PAYMENT_STATUS_PAID  = 20,
  PAYMENT_STATUS_REFUND  = 30,
  PAYMENT_STATUS_FAILED  = 99,
  PAYMENT_STATUS_WAITING_ADJUST  = 25,
}