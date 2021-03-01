import Vue from 'vue'

//字符串首字母大写
export const firstCaseUp = Vue.filter('firstCaseUp', (value:string) => {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//保留小数点后X位数字
export const toFixedX = Vue.filter('toFixedX', (value:number,num:number) => {
  if (!value) return ''
  return value.toFixed(num)
})

//将Date对象转换为当前日期YYYY-MM-DD
export const formatDate = Vue.filter('formatDate',(date:Date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
})

export const objectTpString = Vue.filter('objectTpString', (obj: object) => {
  return JSON.stringify(obj);
})
