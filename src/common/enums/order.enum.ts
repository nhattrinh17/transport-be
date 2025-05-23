export enum ConfigReceiveOrder {
  SHOW = 'SHOW',
  SHOW_AND_TRY = 'SHOW_AND_TRY',
  NOT_SHOW = 'NOT_SHOW',
}

export enum PaymentMethodOrder {
  SENDER = 'SENDER',
  RECEIVER_PAY_ALL = 'RECEIVER_PAY_ALL',
  RECEIVER_PAY_PRODUCT = 'RECEIVER_PAY_PRODUCT',
  RECEIVER_PAY_FEE = 'RECEIVER_PAY_FEE',
}
