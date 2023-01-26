import { Injectable } from '@angular/core';
declare const iSend: any
@Injectable({
  providedIn: 'root',
})
export class ISendServiceService {
  public myEventEmitter: any

  init() {
    iSend.init()
    iSend.developMode();
    this.myEventEmitter = iSend.getEventEmitter();

    // this.myEventEmitter.on('incoming', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('answer', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('hangup', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('call_out', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('conference', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('transfer', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('dnd', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('online', (event) => {
    //   console.log(event)
    // });

    // this.myEventEmitter.on('offline', (event) => {
    //   console.log(event)
    // });

    // var data = {
    //   action: "answer",
    //   data: '1234'
    // }
    // iSend.broadcast(data);
  }

  boardcast(data: any) {
    iSend.broadcast(data);
  }

}
