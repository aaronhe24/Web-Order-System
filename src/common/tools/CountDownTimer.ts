export class CountDownTimer {

  protected remainingTime!:number;
  protected timer!:NodeJS.Timeout;

  constructor(time:number) {
    this.remainingTime = time
  }

  public startTimer () {
    this.timer = setInterval(()=> {
      this.remainingTime -= 1000
      // console.log("remaining: ",this.getRemainingTime())
      if(this.getRemainingTime() < 1000){
        clearInterval(this.timer)
      }
    },1000)
  }

  public getRemainingTime () {
    return this.remainingTime
  }

  public setRemainingTime (time:number) {
    this.remainingTime = time
  }

  public clearTimer () {
    clearInterval(this.timer)
  }

}
