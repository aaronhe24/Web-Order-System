import {Vue} from "vue/types/vue";
const LOGIN_ERROR = 'Not Login';
export class AppHelpers {
  private static helper: AppHelpers


  public static getInstance(){
    if(!this.helper){
      this.helper = new AppHelpers()
    }
    return this.helper
  }

  public roundTowDecimalNumber(price: number):number{
     return Math.round(price * 100)/100
  }

  public sum(priceArray: number[]):number{
    const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
    return priceArray.reduce(reducer);
  }

  public goToLogin(obj: Vue){
    obj.$router.push('signIn')
  }

  public isLogin(response: object):boolean{

    // @ts-ignore
    if(response.status){
      return true
    }
    // @ts-ignore
    return !response.error || response.error !== LOGIN_ERROR
  }





}
