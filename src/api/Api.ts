const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
const AUTOCOMPLETE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

export enum Api {
  Login= "api/webclient/login",
  LoginChecking= "api/webclient/login/checking",
  Logout = "api/webclient/logout",
  OrderDetail = "api/webclient/order/detail",
  MenuCategory = "api/webclient/menu",
  // MenuCategory = "api/shop_menu",
  PlaceOrder = "api/webclient/order/place_order",
  GLOBAL_SETTING = "api/global_settings", //APP全局接口
  AREA_LIST = "api/webclient/area",//地区列表
  USER_ADDR_BOOK_LIST = "api/webclient/user/addrbook/list", //地址簿
  USER_ADDR_BOOK_UPDATE = "api/webclient/user/addrbook/update", //地址簿更新
  USER_ADDR_BOOK_ADD = "api/webclient/user/addrbook/new", //地址簿添加
  USER_ADDR_BOOK_DELET =  "api/webclient/user/addrbook/delete", //地址薄删除
  USER_CUSTOMER_LATLNG = "api/webclient/area/customer_latlng",  //测试地址合法
  FREE_SHIPPING_LIST = "api/organization/list", //免运点列表
  BANNER_LIST = "api/ads/universal_banners", //走马灯列表
  BANNER_SHOP_GROUPS = "api/ads/shop_groups",//横向滑动列表
  BANNER_ALL_INFO = "api/home", //banner聚合接口
  MIDDLE_ADS = "api/middle_ads",//两拦
  BANNER_SHOP_LIST = "api/ads/shop_scrolling", //商家走马灯
  COUPON_PACKAGE = "api/coupon_package/get_available_package", //coupon大礼包
  COUPON_LIST = "api/user/coupons/list/group",//coupon列表
  GIFT_LIST = "api/credits/order/history",//积分商城列表
  GIFT_PRODUCT = "api/credits/products", //积分商城商品
  GIFT_REQUEST = "api/credits/order/submit", //积分商城商品提交
  ORDER_HISTORY = "api/webclient/order/history",//历史订单列表
  ORDER_DETAIL = "api/order_detail", //订单详情
  ORDER_HURRY_UP = "api/hurry_up", //催单
  ORDER_REVIEW = "api/review_order", //评价订单
  ORDER_CREATE_CHARGE = "api/webclient/payment/create_charge", //
  ORDER_CHECK_STATUS = "api/payment/checking_status", //
  PRODUCT_MENU_CATEGORIES = "api/menu_categories", //产品菜单分类
  CAL_SHIPPING_FEE = "api/webclient/shipping_fee/compute",//计算订单运费
  PLACE_ORDER = "api/place_order", //下单
  PROMO_VLIDATE = "api/promo/validate/coupons", // 优惠码校验！！！！！！
  SHARE_ORDER_LIST = "api/pin/list", //拼单
  SHARE_ORDER_MINE = "api/pin/mylist", //我的拼单
  SHARE_ORDER_DETAIL = "api/pin/detail",// 拼单详情
  SHARE_ORDER_CREATE = "api/pin/create", //发起拼单
  SHARE_ORDER_CHECK = "api/pin/check",//查看拼单
  SHARE_ORDER_UPLOAD = "api/pin/upload", //上传照片
  SHARE_ORDER_FINISH = "api/pin/starter/finish",//完成拼单
  SHARE_ORDER_CANCLE = "api/pin/starter/cancel",//取消拼单
  SHOP_LIST = "api/webclient/shop/list", //商家列表
  SHOP_DETATIL = "api/webclient/shop/detail", //商户详情
  // SHOP_DETATIL = "api/shop", //商户详情
  SHOP_SEARCH = "api/webclient/shop/search",//搜索商家！！！！！！
  SHOP_CITY = "api/city_shop_list",//搜索自动补全
  SHOP_EVENT = "api/https://wechat.foodhwy.com/market_event/half_price_countdown/list",//活动商家
  GOOGLE_DIRECTION = "api/google/direction",//获取谷歌地图路径
  GOOGLE_LOGIN = "api/login/goole",//微信登录
  ACCOUNT_LOGIN = "api/login", //登录
  ACCOUNT_LOGOUT = "api/logout", //登出
  CHECK = "api/check",//检验大礼包
  REQUEST_VERIFICODE = "api/webclient/verification_code/request",//获取验证码
  CHECK_VERIFICODE = "api/webclient/verification_code/check",//校验验证码
  USER_DETAIL = "api/user/detail",//用户详情
  NOTIFICATION_REGISTER = "api/user/notification/register",//注册推送
  REDEEM_PACKACK = "api/coupon_package/redeem_package",//获取大礼包
  USER_CREDITCARD_LIST = "api/user/credit_card/list",//用户信用卡列表
  USER_ADD_CREDIT_CARD = "api/user/credit_card/add",//添加信用卡
  USER_DELET_CREDIT_CARD = "api/user/credit_card/delete",//删除信用卡
  LONG_URL_TO_SHORT = "api/short_url/fetch", //长链接换短连接
  SHORT_URTL_TO_LONG = "api/short_url/generate", //短连接环长链接
  CHANGE_PAYMENT_TYPE = "api/change_payment_type", //修改订单付款方式
  GET_SESSION = "api/getting_app_session", //获取session
  GET_EXPRESSORDER = "api/express", //扫码直达下单
  CUSTOM_SHOP_LIST = "api/shoplist/ids", //获取定制化shoplist
  GROUP_ORDER = "api/group_order", //获取团餐商家列表
  GROUP_ORDER_POINT_LIST = "api/group_order/list",//获取团餐点列表
  GET_EXPRESS_ORDERS = "api/express_order/list", //获取直达订单列表
  // GOOGLE_PLACE_FULL_API = "https://maps.googleapis.com/maps/api/place/autocomplete/json", //自动补全地址api
  GOOGLE_PLACE_FULL_API = "api/webclient/map/autocomplete", //自动补全地址api
  LATLNG_TO_ADDRESS = "api/webclient/map/latlng2address", //经纬度反查地址api
  GET_SHARE_SHORT_URL =  "api/short_url/share", //分享时调用分享信息接口
  CART_CALCULATE = "api/webclient/cart/calculate",
  SEND_RECEIPT = "api/webclient/receipt/request",


// ----- 0516 -------------
//banner聚合接口 V2
  BANNER_ALL_INFO_V2 = "api/home/v2", //banner聚合接口
// 原有接口/api/shoplist/v2 拆分为两个独立的接口
// 商家列表部分
  SHOP_LIST_NEW ="api/shops",
// 获取登陆用户的历史订单餐馆
  SHOP_LIST_HISTORY = "api/shops/history",

// 推荐商品接口
  PRODUCT_LIST_RECOMMEND = "api/productlist/recommend",
// ----- 0516 -------------
// ----- 0617 -------------
// moneris支付 获取token
  CREDIT_CARD_GET_TOKEN = "api/payment/credit_card/get_token",
// ----- 0617 -------------

// ----- 0706 -------------
  EMAIL_BINDING = "api/user/email_binding/submit",

//0707
//url event事件统计
  URL_EVENT_STAT ="api/stat/url_event_stat",

//0727
//请求发送订单收据
  RECEIPT = "api/user/receipt/request",
//直达分组
  EXPRESS_GROUPS = "api/express_order/groups",
//直达分组 (商家内)
  EXPRESS_GROUPS_IN_SHOP = "api/shop/express",

//0812
//热门推荐关键词
 RECOMMEND_KEYWORDS = "api/recommend_keywords",
//0813
 POST_APP_LOG = "api/app_log",

//0818
//上传头像
 UPLOAD_AVATAR = "user/upload_avatar",

//0826
//发现
 DISCOVER_DISCOVER = "api/home/discover",

//0921
//商家海报分享
DISCOVER_SHOP_SHARE_PLACARD = "api/share/share_image",
}
