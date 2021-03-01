import {Locales} from "@/i18n/locales";

//读取浏览器缓存
export function getLocalStorage() {
  const sessionUser = window.localStorage.getItem('user')
  const sessionAddress = window.localStorage.getItem('address')
  const sessionCityId = window.localStorage.getItem('city_id')
  const language = window.localStorage.getItem('language')
  const sessionLatLng = window.localStorage.getItem('user_latlng');
  const sessionAddressCategory = window.localStorage.getItem('address_category')
  const sessionCart= window.localStorage.getItem("shopping_cart")
  const sessionContact= window.localStorage.getItem("contact")
  const defaultLocale = language ? language : Locales.EN;
  return{
    defaultLocale,
    sessionUser,
    sessionAddress,
    sessionCityId,
    sessionAddressCategory,
    sessionLatLng,
    sessionCart,
    sessionContact,
  }

}
