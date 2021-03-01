# 目前应用的api

 * Login= "api/login" //登录 CHANGED TO `api/webclient/login`
 * Logout = "api/logout" //登出 CHANGED TO `api/webclient/logout`
 * AddressBook = "api/user/addrbook/list" //获取地址簿 CHANGED TO `api/webclient/user/addrbook/list`
 * OrderDetail = "api/order_detail" //订单详情 CHANGED TO `api/webclient/order/detail` ❗️
 * MenuCategory = "api/menu_categories" //菜单列表 CHANGED TO `api/webclient/menu` ❗️
 * PlaceOrder = "api/place_order" //下单 CHANGED TO `api/webclient/order/place_order` ❗️
 * AREA_LIST = "api/area",//地区列表 CHANGED TO `api/webclient/area`
 * USER_ADDR_BOOK_UPDATE = "api/user/addrbook/update"  //地址簿更新 CHANGED TO `api/webclient/user/addrbook/update`
 * USER_ADDR_BOOK_ADD = "api/user/addrbook/new"  //地址簿添加 CHANGED TO `api/webclient/user/addrbook/new`
 * USER_ADDR_BOOK_DELET =  "api/user/addrbook/delete", //地址薄删除 CHANGED TO `api/webclient/user/addrbook/delete`
 * USER_CUSTOMER_LATLNG = "api/area/customer_latlng"  //测试地址合法 CHANGED TO `api/webclient/area/customer_latlng`
 * ORDER_CREATE_CHARGE = "api/payment/create_charge" CHANGED TO `api/webclient/payment/create_charge` ❗️
 * CAL_SHIPPING_FEE = "api/cal_shipping_fee" //计算订单运费 CHANGED TO `api/webclient/shipping_fee/compute` ❗️
 * SHOP_LIST = "api/shoplist/v2" //商家列表 CHANGED TO `api/webclient/shop/list` ❗️
 * REQUEST_VERIFICODE = "api/request_verificode" //获取验证码 CHANGED TO `api/webclient/verification_code/request` ❗️
 * CHECK_VERIFICODE = "api/check_verificode" //校验验证码 CHANGED TO `api/webclient/verification_code/check` ❗️
 * GOOGLE_PLACE_FULL_API = "https://maps.googleapis.com/maps/api/place/autocomplete/json" //自动补全地址api
 * CART_CALCULATE = "api/cart/calculate" //计算购物车 CHANGED TO `api/webclient/cart/calculate`

# 即将会用到的api

* ORDER_HISTORY = "api/order_history" //历史订单列表 CHANGED TO `api/webclient/order/history` ❗️
* SHOP_DETATIL = "api/shop" //商户详情 CHANGED TO `api/webclient/shop/detail` ❗️
//搜索的api应为/search_shop,之前输入有误
* SHOP_SEARCH = "api/search_shop" //搜索商家 `api/webclient/shop/search` ❗️
* SHOP_CITY = "api/city_shop_list",//搜索自动补全 `api/city_shop_list` ❗️
