import {AddrBook, ExistedAddrBook} from "@/module/interface/AddrBook";
import {ApiHelper} from "@/api/ApiHelper";

export class AddrBookLogic {
  private static addrBookLogic: AddrBookLogic;
  private apiHelper = ApiHelper.getInstance();
  private addrBookList: ExistedAddrBook[] = [];
  private enableSelect = 1;

  public static getInstance() {
    if (!this.addrBookLogic) {
      this.addrBookLogic = new AddrBookLogic();
    }
    return this.addrBookLogic;
  }

  public async fetchAddrBook() {
    try {
      const response = await this.apiHelper.getAddressBook();
      if (this.checkResState(response)) {
        this.addrBookList = response.data.data;
      } else {
        this.addrBookList = [];
      }
      return response.data
    } catch (e) {
      console.log(e);
      return this.apiHelper.getErrorMessage(e)
    }
  }


  public getAddrBook(): ExistedAddrBook[] {
    return this.addrBookList;
  }

  public async createAddrBook(addrBook: AddrBook) {
    try {
      const response = await this.apiHelper.postNewAddressBook(addrBook);
      this.checkResState(response);
    } catch (e) {
      console.log(e);
    }
  }

  public async updateAddrBook(addrBook: ExistedAddrBook) {
    try {
      const response = await this.apiHelper.postUpdateAddressBook(addrBook);
      this.checkResState(response);
    } catch (e) {
      console.log(e);
    }
  }

  public async deleteAddrBook(id: number) {
    try {
      const response = await this.apiHelper.postDeleteAddressBook(id);
      this.checkResState(response);
    } catch (e) {
      console.log(e);
    }
  }

  public checkResState(res: any): boolean {
    if (res.data.status === 0) {
      alert(res.data.error);
      return false;
    } else {
      return true;
    }
  }

  public getEnableSelect(): number{
    return this.enableSelect;
  }

  public setEnableSelect(enable: number){
    this.enableSelect = enable
  }


}
