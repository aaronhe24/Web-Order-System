import {BaseGeoLogic} from "@/logic/goeLogic/BaseGeoLogic";
import {GlobalSettingPreference} from "@/GlobalSettingPreference";

export class OrgH5GeoLogic extends BaseGeoLogic{

  public static getInstance(){
    if(!this.logic){
      this.logic = new OrgH5GeoLogic()
    }
    return this.logic;
  }

  private userLatLng:any;
  private globalSettings = GlobalSettingPreference.getInstance();

  public getLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position:Position) => {
          // console.log(position.coords.latitude)
          // console.log(position.coords.longitude)
          this.userLatLng = position.coords.latitude.toString() + position.coords.longitude.toString()
          this.globalSettings.setUserLatLng(position.coords.latitude,position.coords.longitude)
          this.globalSettings.setUserLatLngSession(position.coords.latitude,position.coords.longitude)
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  public getDistanceBetween(lat1:number,lon1:number,lat2:number,lon2:number) {
    // console.log(lat1,lon1,lat2,lon2)
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1);
    let a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d.toFixed(2);
  }

  private deg2rad(deg:number) {
    return deg * (Math.PI/180)
  }


  public getUserLatLng(){
    return this.userLatLng
  }




}
