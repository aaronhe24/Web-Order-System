import {ShopFullDiscount} from "@/module/interface/ShopFullDiscount";
import {ShopProductSale} from "@/module/interface/ShopProductSale";


export interface ShopDetail{
  mid: number;
  bid: number;
  name: string;
  desc: string;
  cart_desc: string;
  thumb: string;
  thumb_small: string;
  preview_img: string;
  gallery: string[];
  city: string;
  addr: string;
  lat: number;
  lon: number;
  tel: string;
  tax_rate: number;
  shipping_base_km: number;
  shipping_increment_fee: number;
  shipping_base_fee: number;
  open: number;
  cooking_minutes: number;
  hours: string;
  segment_id: number;
  online_payment: number;
  data: DetailData;
  delivery_setting_ids: string;
  min_amount: number;
  area_id: number;
  credits_shop_id: number;
  shipping_guide: string;
  supported_order_types: string[];
  preorder_setting: PreorderSetting;
  supported_payment_methods: string[];
  customer_pickup: number;
  tags: Tag[];
  biz_circle_name: string;
  horn_message: string;
  today_open_time: string;
  platform_rate: string;
  shop_rating: string;
  payment_charge_fee: PaymentChargeFee;
  unreviewed_order_id: number;
}



export interface Contacts {
    sms: string;
    email: string;
  }

  export interface CustomHTML {
    notifyBar: string;
    beforeNav: string;
    afterCart: string;
  }

  export interface TakeOut {
    bookable: boolean;
    needVerify: boolean;
    printers: any[];
    profile: any[];
    contacts: Contacts;
    customHTML: CustomHTML;
    available_hours?: any;
    isAutoOpenTomorrow: number;
  }

  export interface Contacts2 {
    sms: string;
    email: string;
  }

  export interface CustomHTML2 {
    notifyBar: string;
    beforeNav: string;
    afterCart: string;
  }

  export interface EatIn {
    printers: any[];
    SpecifyAddresses: any[];
    profile: any[];
    contacts: Contacts2;
    customHTML: CustomHTML2;
    bookable: boolean;
  }

  export interface Contacts3 {
    sms: string;
    email: string;
  }

  export interface BookSeat {
    profile: any[];
    contacts: Contacts3;
    printers: any[];
  }

  export interface Contacts4 {
    sms: string;
    email: string;
  }

  export interface CustomHTML3 {
    header: string;
    footer: string;
  }

  export interface Suggestion {
    contacts: Contacts4;
    customHTML: CustomHTML3;
  }

  export interface CommunicationLanguage {
    chinese: boolean;
    english: boolean;
    cantonese: boolean;
  }

  export interface Preorder {
    enabled: number;
    ahead_days: number;
    ahead_mins: number;
    app_days: number;
    ahead_minutes: number;
  }

  export interface AutoOpenCloseTime {
    start: string[];
    end: string[];
  }

  export interface FlashSale {
    enabled: number;
    platform_discount: number;
    merchant_discount: number;
    start_date: string;
    end_date: string;
    code: string;
  }

  export interface PaymentMethod {
    cash: boolean;
    online: boolean;
  }



  export interface DiscountEvents {
    shop_full_discount?: ShopFullDiscount[];
    shop_product_sale?: ShopProductSale[];
  }

  export interface ExpressOrder {
    enabled: number;
    id: number;
  }

  export interface ServiceFee {
    enabled: number;
    type: string;
    rules: any[];
  }

  export interface DetailData {
    currency?: any;
    cdnURL?: any;
    takeOut: TakeOut;
    eatIn: EatIn;
    bookSeat: BookSeat;
    suggestion: Suggestion;
    communication_language: CommunicationLanguage;
    delivery_time: number;
    platform_rate?: any;
    online_payment: number;
    preorder: Preorder;
    autoOpenCloseTime: AutoOpenCloseTime;
    flash_sale: FlashSale;
    pay_foodhwy: string;
    tax_rate: number;
    time_zone: string;
    shipping_derate: number;
    payment_method: PaymentMethod;
    discount_events?: DiscountEvents;
    timeRange: any[];
    free_driver_shipping_fee: number;
    grab_enabled: number;
    customer_pickup: number;
    atuo_call: number;
    credit_rate: number;
    intro: string;
    memo: string;
    min_amount: string;
    delivery_setting_ids: string;
    shipping_fee: string;
    shipping_max: string;
    full_sale: FullSale;
    expressOrder: ExpressOrder;
    service_tip: number;
    payment_charge_fee: string;
    service_fee: ServiceFee;
    auto_call: number
  }

  export interface FullSale {
    code:string
  }

  export interface Day {
    day: string;
    dayOfWeek: string;
  }

  export interface PreorderSetting {
    enabled: number;
    ahead_days: number;
    ahead_mins: number;
    shifts: string[];
    days: Day[];
    auto_interval: number;
  }

  export interface Tag {
    tag: string;
    color: string;
  }

  export interface PaymentChargeFee {
    onlinepay: number;
    wxpay: number;
    alipay: number;
    emtpay: number;
    applepay: number;
  }


export function createDefaultShopDetail():ShopDetail {
  return {
    unreviewed_order_id: 0,
    "mid": 0,
    "bid": 0,
    "name": "",
    "desc": "<div style=\"text-align: center;\"><p class=\"p1\"><span style=\"font-family: 宋体;\">本餐馆送餐时间为 12:00-22:00</span><br></p></div><div style=\"text-align: center;\"><span style=\"font-weight: 700; text-align: start;\"><u>餐单费＋运费不含税，税钱将另加！</u></span></div>",
    "cart_desc": "<p class=\"p1\">温馨提示：</p><p class=\"p1\">1.<u style=\"font-family: inherit; line-height: 1.42857143; font-weight: bold;\">餐单费＋运费不含HST，税钱将另加！</u></p><p class=\"p1\">2.本餐馆送餐时间为：12:00-22:00</p><p class=\"p1\">3.送餐收费：<span style=\"font-family: inherit; line-height: 1.42857143;\">餐厅到住址7公里内收取$5，超过的每公里数多收$1</span></p><p class=\"p1\">4.如为您带来不便，敬请原谅。</p>",
    "thumb": "",
    "thumb_small": "",
    "preview_img": "",
    "gallery": [""],
    "city": "Scarborough",
    "addr": "",
    "lat": 43.857471,
    "lon": -79.355764,
    "tel": "905-270-5988",
    "tax_rate": 0.13,
    "shipping_base_km": 0,
    "shipping_increment_fee": 0,
    "shipping_base_fee": 5,
    "open": 1,
    "cooking_minutes": 0,
    "hours": "",
    "segment_id": 1712,
    "online_payment": 1,
    "data": {
      "currency": null,
      "cdnURL": null,
      "takeOut": {
        "bookable": true,
        "needVerify": false,
        "printers": [],
        "profile": [],
        "contacts": {
          "sms": "",
          "email": "foodhwyclientservice@gmail.com"
        },
        "customHTML": {
          "notifyBar": "亲~如果要点煲仔饭，等候时间可能会延长哦！<div>\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n<p class=\"p1\">Foodhwy微信订餐正处于测试阶段，若遇到紧急问题，请联系负责人：David 647-818-7988。谢谢您的支持！</p></div>",
          "beforeNav": "",
          "afterCart": "<p class=\"p1\">温馨提示：</p><p class=\"p1\">1.<u style=\"font-family: inherit; line-height: 1.42857143; font-weight: bold;\">餐单费＋运费不含税，税钱将另加！</u></p>\r\n<p class=\"p1\">2.本餐馆送餐时间为：12:00-22:00</p>\r\n<p class=\"p1\">3.送餐收费：<span style=\"font-family: inherit; line-height: 1.42857143;\">餐厅到住址7公里内收取$5，超过的每公里数多收$1</span></p>\r\n<p class=\"p1\">4.如为您带来不便，敬请原谅。</p>"
        },
        "available_hours": null,
        "isAutoOpenTomorrow": 0
      },
      "eatIn": {
        "printers": [],
        "SpecifyAddresses": [],
        "profile": [],
        "contacts": {
          "sms": "",
          "email": ""
        },
        "customHTML": {
          "notifyBar": "",
          "beforeNav": "",
          "afterCart": ""
        },
        "bookable": true
      },
      "bookSeat": {
        "profile": [],
        "contacts": {
          "sms": "",
          "email": ""
        },
        "printers": []
      },
      "suggestion": {
        "contacts": {
          "sms": "",
          "email": ""
        },
        "customHTML": {
          "header": "",
          "footer": ""
        }
      },
      "communication_language": {
        "chinese": false,
        "english": false,
        "cantonese": false
      },
      "delivery_time": 25,
      "platform_rate": null,
      "online_payment": 0,
      "preorder": {
        "enabled": 1,
        "ahead_days": 1,
        "ahead_mins": 6,
        "app_days": 0,
        "ahead_minutes": 0
      },
      "autoOpenCloseTime": {
        "start": [
          "12:00",
          "12:00",
          "10:01",
          "11:59",
          "12:00",
          "12:00",
          "12:00"
        ],
        "end": [
          "22:00",
          "22:00",
          "23:55",
          "22:00",
          "22:00",
          "22:00",
          "22:00"
        ]
      },
      "full_sale":{
        "code": ""
      },
      "flash_sale": {
        "enabled": 0,
        "platform_discount": 0,
        "merchant_discount": 0,
        "start_date": "2018-07-13",
        "end_date": "2018-07-13",
        "code": ""
      },
      "pay_foodhwy": "cash",
      "tax_rate": 0.13,
      "time_zone": "America/Toronto",
      "shipping_derate": 3,
      "payment_method": {
        "cash": true,
        "online": false
      },
      "discount_events": {
        "shop_full_discount": [
          {
            "id": 135,
            "shop_id": 12908,
            "shop_ids": "",
            "discount_code": "MJ895307",
            "discount_amount": 4,
            "discount_type": "integer",
            "event": "shop_full_discount",
            "enabled": 1,
            "start_date": "2020-12-08 00:00:00",
            "end_date": "2020-12-30 00:00:00",
            "created_at": "2020-12-08 18:42:33",
            "updated_at": "2020-12-08 18:42:33",
            "batch_id": 0,
            "limit_times": 0,
            "use_type": "internal",
            "festival_event_id": 0,
            "shipping_type": "delivery",
            "is_dailyonce": 0,
            "discount_group": "normal_discount",
            "options": {
              "platform_discount": 2,
              "merchant_discount": 2,
              "shop_name": "潮州佬",
              "shop_img": "http://img.foodhwy.com/media/bid-821/merchants/12908/3b3acd9712ea38380aedb69e575bfdc2.jpeg",
              "discount_tag": "",
              "discount_desc": "",
              "full_amount": 10,
              "gift_product": ""
            }
          },
          {
            "id": 136,
            "shop_id": 12908,
            "shop_ids": "",
            "discount_code": "MJ338373",
            "discount_amount": 5,
            "discount_type": "integer",
            "event": "shop_full_discount",
            "enabled": 1,
            "start_date": "2020-12-08 00:00:00",
            "end_date": "2020-12-30 00:00:00",
            "created_at": "2020-12-08 18:43:08",
            "updated_at": "2020-12-08 18:43:59",
            "batch_id": 0,
            "limit_times": 0,
            "use_type": "internal",
            "festival_event_id": 0,
            "shipping_type": "delivery",
            "is_dailyonce": 0,
            "discount_group": "normal_discount",
            "options": {
              "platform_discount": 2,
              "merchant_discount": 3,
              "shop_name": "潮州佬",
              "shop_img": "http://img.foodhwy.com/media/bid-821/merchants/12908/3b3acd9712ea38380aedb69e575bfdc2.jpeg",
              "discount_tag": "",
              "discount_desc": "",
              "full_amount": 15,
              "gift_product": ""
            }
          },
          {
            "id": 137,
            "shop_id": 12908,
            "shop_ids": "",
            "discount_code": "MJ506138",
            "discount_amount": 6,
            "discount_type": "integer",
            "event": "shop_full_discount",
            "enabled": 1,
            "start_date": "2020-12-08 00:00:00",
            "end_date": "2020-12-30 00:00:00",
            "created_at": "2020-12-08 18:43:45",
            "updated_at": "2020-12-08 18:43:55",
            "batch_id": 0,
            "limit_times": 0,
            "use_type": "internal",
            "festival_event_id": 0,
            "shipping_type": "delivery",
            "is_dailyonce": 0,
            "discount_group": "normal_discount",
            "options": {
              "platform_discount": 4,
              "merchant_discount": 2,
              "shop_name": "潮州佬",
              "shop_img": "http://img.foodhwy.com/media/bid-821/merchants/12908/3b3acd9712ea38380aedb69e575bfdc2.jpeg",
              "discount_tag": "",
              "discount_desc": "",
              "full_amount": 20,
              "gift_product": ""
            }
          }
        ],
        "shop_product_sale": [
          {
            "id": 142,
            "shop_id": 12908,
            "shop_ids": "",
            "discount_code": "SP159909",
            "discount_amount": 0,
            "discount_type": "integer",
            "event": "shop_product_sale",
            "enabled": 1,
            "start_date": "2020-12-11 19:22:00",
            "end_date": "2020-12-31 19:22:00",
            "created_at": "2020-12-10 23:03:21",
            "updated_at": "2020-12-11 19:23:04",
            "batch_id": 0,
            "limit_times": 0,
            "use_type": "external",
            "festival_event_id": 0,
            "shipping_type": "delivery",
            "is_dailyonce": 0,
            "discount_group": "normal_discount",
            "options": {
              "platform_discount": 0,
              "merchant_discount": 0,
              "shop_name": "潮州佬",
              "shop_img": "http://img.foodhwy.com/media/bid-821/merchants/12908/3b3acd9712ea38380aedb69e575bfdc2.jpeg",
              "discount_message": "",
              "discount_tag": "",
              "discount_desc": "",
              "order_limit_times": 2
            }
          }
        ]
      },
      "timeRange": [],
      "free_driver_shipping_fee": 0,
      "grab_enabled": 0,
      "customer_pickup": 0,
      "atuo_call": 0,
      "credit_rate": 0,
      "intro": "",
      "memo": "",
      "min_amount": "",
      "delivery_setting_ids": "",
      "shipping_fee": "",
      "shipping_max": "",
      "expressOrder": {
        "enabled": 0,
        "id": 0
      },
      "service_tip": 0,
      "payment_charge_fee": "",
      "service_fee": {
        "enabled": 0,
        "type": "",
        "rules": []
      },
      "auto_call": 0
    },
    "delivery_setting_ids": "",
    "min_amount": 0,
    "area_id": 0,
    "credits_shop_id": 12978,
    "shipping_guide": "",
    "supported_order_types": [
    "normal"
  ],
    "preorder_setting": {
    "enabled": 0,
      "ahead_days": 1,
      "ahead_mins": 0,
      "shifts": [
      "11:00 - 11:30",
      "11:30 - 12:00",
      "12:00 - 12:30",
      "12:30 - 13:00",
      "13:00 - 13:30",
      "13:30 - 14:00",
      "14:00 - 14:30",
      "14:30 - 15:00",
      "15:00 - 15:30",
      "15:30 - 16:00",
      "16:00 - 16:30",
      "16:30 - 17:00",
      "17:00 - 17:30",
      "17:30 - 18:00",
      "18:00 - 18:30",
      "18:30 - 19:00",
      "19:00 - 19:30",
      "19:30 - 20:00",
      "20:00 - 20:30",
      "20:30 - 21:00",
      "21:00 - 21:30",
      "21:30 - 22:00",
      "22:00 - 22:30",
      "22:30 - 23:00",
      "23:00 - 23:30",
      "23:30 - 00:00"
    ],
      "days": [
      {
        "day": "2020-12-09",
        "dayOfWeek": "周三"
      },
      {
        "day": "2020-12-10",
        "dayOfWeek": "周四"
      },
      {
        "day": "2020-12-11",
        "dayOfWeek": "周五"
      },
      {
        "day": "2020-12-12",
        "dayOfWeek": "周六"
      },
      {
        "day": "2020-12-13",
        "dayOfWeek": "周日"
      },
      {
        "day": "2020-12-14",
        "dayOfWeek": "周一"
      }
    ],
      "auto_interval": 1
  },
    "supported_payment_methods": [
    "onlinepay",
    "cashpay"
  ],
    "customer_pickup": 1,
    "tags": [
    {
      "tag": "",
      "color": "#ffffff"
    }
  ],
    "biz_circle_name": "Scarborough",
    "horn_message": "从北京大学校园内400份共享计划",
    "today_open_time": "13:00 - 23:59",
    "platform_rate": "0.00",
    "shop_rating": "0.0",
    "payment_charge_fee": {
    "onlinepay": 1.5,
      "wxpay": 1.5,
      "alipay": 1.5,
      "emtpay": 1.5,
      "applepay": 1.5
  }
  }

}


