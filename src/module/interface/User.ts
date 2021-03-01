export interface  User {
  token: string;
  username: string;
  cid: number;
  name: string;
  phone: string;
  address: string;
  credit: number;
  created_at: string;
  avatar: string;
  invite_code: string;
  address_unit: string;
  address_buzz: string;
  order_count: number;
  carrier_name: string;
  carrier_type: string;
  email: string;
  email_verified: number;
  coupons_count: number;
  additional_token: AdditionalToken;
}

export interface AdditionalToken {
  header_key: string
  header_value: string
}
export class AdditionalToken {
  public header_key =""
  public header_value =""
}

export class User {
  public token =""
  public username = ""
  public cid = 0
  public name = ""
  public phone = ""
  public credit= 0
  public created_at=""
  public avatar= ""
  public invite_code= ""
  public address_unit= ""
  public address_buzz= ""
  public order_count= 0
  public carrier_name= ""
  public carrier_type=""
  public email= ""
  public email_verified= 0
  public coupons_count= 0
  public additional_token = new AdditionalToken()
  public loginAt = 0;
  public password ='';
  public phone_num=''



  static initUser(u: User){
    let user = new User()
    user.token = u.token
    user.username = u.username
    user.cid = u.cid
    user.name = u.name
    user.phone = u.phone
    user.credit= u.credit
    user.created_at= u.created_at
    user.avatar= u.avatar
    user.invite_code= u.invite_code
    user.address_unit= u.address_unit
    user.address_buzz= u.address_buzz
    user.order_count= u.order_count
    user.carrier_name= u.carrier_name
    user.carrier_type= u.carrier_type
    user.email= u.email
    user.email_verified= u.email_verified
    user.coupons_count= u.coupons_count
    user.additional_token = u.additional_token
    user.loginAt = u.loginAt ? u.loginAt : 0;
    user.password = u.password ? u.password : '';
    user.phone_num = u.phone_num ? u.phone_num : '';
    return user;
  }


  isAutoLogin(){
    return this.phone_num && this.password
  }

}


