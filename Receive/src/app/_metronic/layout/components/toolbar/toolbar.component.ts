import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { LayoutService } from '../../core/layout.service';
import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ISendServiceService } from '../../../../services/iSend-service/iSend-service.service';
declare var $: any;

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  timePassed = 0;
  intervalId: any;
  timer = '00:00';
  callconference: any = [];
  callList: any = {};
  state = '';
  callArray: any = [];
  operationStatus = 'online';
  numpad = '';
  actionNameList: any = {
    incoming: 'สายเข้า',
    answer: 'กำลังสนทนา',
    hangup: 'วางสาย',
    callout: 'โทรออก',
    transfer: 'กำลังโอนสาย',
  };
  minutes: number;
  seconds: number;
  milliseconds: number;
  interval: any;
  isOpenCallPopup = false;

  toolbarcalloutClass = 'symbol-30px symbol-md-40px';
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarButtonHeightClass = 'w-60px h-60px w-md-60px h-md-60px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  iconmic: string = './assets/img/iconnumber/mic.svg';
  iconspeaker: string = './assets/img/iconnumber/speaker.svg';
  status = 'Enable';
  isMicOn = true;
  showLine = false;
  modalName = 'Online';
  bulletColor = 'online-bullet';

  @ViewChild('ktPageTitle', { static: true }) ktPageTitle: ElementRef;
  pageTitleAttributes: {
    [attrName: string]: string | boolean;
  };
  toolbarContainerCssClasses: string = '';
  pageTitleCssClasses: string = '';

  constructor(
    private layout: LayoutService,
    private modalService: NgbModal,
    private iSend: ISendServiceService,
    private cd: ChangeDetectorRef
  ) {
    this.iSend.init();
  }

  ngOnInit(): void {
    this.toolbarContainerCssClasses =
      this.layout.getStringCSSClasses('toolbarContainer');
    this.pageTitleCssClasses = this.layout.getStringCSSClasses('pageTitle');
    this.pageTitleAttributes = this.layout.getHTMLAttributes('pageTitle');
    this.iSend.myEventEmitter.on('incoming', (event: any) => {
      this.onIncoming(event);
    });
    this.onClose();
    this.onAnswer();
    this.onCallout();
    this.onTransfer();
    this.onHangup();
    this.onMic();
    this.onUnMic();
    this.onMute();
    this.onUnMute();
    this.onCreateconference();
    this.onCreatecomplete();
    this.onCreatefalse();
    this.onJoincomplete();
    this.onHangupconference();
    this.onCloseconference();
    this.onDNDshort();
    this.onDNDlong();
    this.onDNDlast();
    this.onOnline();
    this.onOffline();
    this.onOConnectWebAgent();
    this.onCallout_transfer();
    this.onTransfercomplete();
    this.onCalling();
    this.onGetStatus();
    this.getStatus();
  }

  ngAfterViewInit() {
    if (this.ktPageTitle) {
      for (const key in this.pageTitleAttributes) {
        if (
          this.pageTitleAttributes.hasOwnProperty(key) &&
          this.ktPageTitle.nativeElement
        ) {
          this.ktPageTitle.nativeElement.attributes[key] =
            this.pageTitleAttributes[key];
        }
      }
    }
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timePassed++;
      const minutes = Math.floor(this.timePassed / 60);
      const seconds = this.timePassed % 60;
      const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
      const secondsString = seconds < 10 ? '0' + seconds : seconds.toString();
      this.timer = `${minutesString}:${secondsString}`;
      this.cd.detectChanges();
    }, 1000);
  }

  changeModalNameAndColor(modalName: string, bulletColor: string) {
    this.modalName = modalName;
    this.bulletColor = bulletColor;
  }

  stopTimer() {
    clearInterval(this.intervalId);
    this.timePassed = 0;
  }

  deleteNumber() {
    this.numpad = this.numpad.slice(0, -1);
  }

  onCkickNumPad(key: any) {
    this.numpad += key;
  }

  enablemic() {
    this.iconmic === './assets/img/iconnumber/mic.svg'
      ? (this.iconmic = './assets/img/iconnumber/micoff.svg')
      : (this.iconmic = './assets/img/iconnumber/mic.svg');
  }

  enablespeaker() {
    this.iconspeaker === './assets/img/iconnumber/speaker.svg'
      ? (this.iconspeaker = './assets/img/iconnumber/speakeroff.svg')
      : (this.iconspeaker = './assets/img/iconnumber/speaker.svg');
  }

  toggleMic(number: any) {
    this.isMicOn = !this.isMicOn;
    this.isMicOn ? this.mic(number) : this.unmic(number);
    console.log(this.iconmic);
  }

  toggleMute(number: any) {
    this.isMicOn = !this.isMicOn;
    this.isMicOn ? this.mute(number) : this.unmute(number);
  }

  onGetStatus() {
    this.iSend.myEventEmitter.on('getstatus', (event: any) => {
      console.log(this.callList);
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
        if (event.callList) {
          this.callList = event.callList;
          this.callArray = Object.keys(event.callList);
        }
      }
    });
  }

  getStatus() {
    this.iSend.boardcast({
      action: 'getstatus',
      sender: 'icrm',
    });
  }

  onOConnectWebAgent() {
    this.iSend.myEventEmitter.on('connectwebagent', (event: any) => {
      console.log(event);
    });
  }

  connectWebAgent() {
    this.iSend.boardcast({
      action: 'connectwebagent',
      data: '1234',
    });
  }

  onClose() {
    this.iSend.myEventEmitter.on('close', (event: any) => {
      delete this.callList[event.close_number];
      if (event.sender === 'webagent') {
        this.callList[event.close_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
      }
      this.cd.detectChanges();
    });
  }

  close(number: any) {
    this.iSend.boardcast({
      action: 'hangup',
      close_number: number,
      sender: 'icrm',
    });
  }

  onIncoming(event: any) {
    this.callList[event.incoming_number] = event;
    this.callArray = Object.keys(this.callList);
    this.state = event['action'];
    console.log(this.callArray);
    console.log(this.callList);
    this.cd.detectChanges();
    $('#incoming').modal('show');
    /* if (!this.isOpenCallPopup) {
      document.getElementById('callingtab').click();
      this.cd.detectChanges();
    } */
  }

  onAnswer() {
    this.iSend.myEventEmitter.on('answer', (event: any) => {
      if (event.sender === 'webagent') {
        this.startTimer();
        this.callList[event.answer_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.cd.detectChanges();
      }
    });
  }

  answer(number: any) {
    this.iSend.boardcast({
      action: 'answer',
      answer_number: number,
      sender: 'icrm',
    });
  }

  onHangup() {
    this.iSend.myEventEmitter.on('hangup', (event : any) => {
      delete this.callList[event.hangup_number]
      this.callArray = Object.keys(this.callList)
      this.state = event['action']
      console.log(this.callArray);
      console.log(this.callList)
      if (Object.keys(this.callList).length == 0) {
          this.state = ''
      }
      this.cd.detectChanges();
    });
  }

  hangup(number: any) {
    this.iSend.boardcast({
      action: 'hangup',
      hangup_number: number,
      sender: 'icrm',
    });
  }

  onTransfer() {
    this.iSend.myEventEmitter.on('transfer', (event: any) => {
      delete this.callList[event.transfer_number];
      if (event.sender === 'webagent') {
        this.callList[event.transfer_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        $('#numpad').modal('show');
      }
      this.cd.detectChanges();
    });
   /*  this.iSend.myEventEmitter.on('transfer', (event: any) => {
      delete this.callList[event.transfer_number];
      if (event.sender === 'webagent') {
        this.callList[event.transfer_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        this.cd.detectChanges();
      }
      $('#numpad').modal('show');
      this.cd.detectChanges();
    }); */
  }



  onCalling() {
    this.iSend.myEventEmitter.on('calling', (event: any) => {
      delete this.callList[event.calling_number];
      if (event.sender === 'webagent') {
        this.callList[event.calling_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        this.cd.detectChanges();
      }
      $('#incoming').modal('hide');
      $('#incoming').on('hidden.bs.modal', function () {
        // Load up a new modal...
        $('#calling').modal('show');
      });

      this.cd.detectChanges();
    });
  }

  calling(number: any) {
    this.iSend.boardcast({
      action: 'calling',
      calling_number: number,
      sender: 'icrm',
    });
  }

  onCallout() {
    this.iSend.myEventEmitter.on('callout', (event: any) => {
      if (event.sender === 'webagent') {
        this.callList[event.callout_number] = event;
        this.callArray = Object.keys(this.callList);
        console.log(this.callArray);
        this.cd.detectChanges();
       /*  if (!this.isOpenCallPopup) {
          document.getElementById('callingtab').click();
          this.cd.detectChanges();
        } */
        $('#callout-popup').modal('hide');
         $('#callout-popup').on('hidden.bs.modal', function () {
          $('#incoming').modal('show');
        });
       /*  $('#incoming').modal('show'); */
        $('#calling').modal('hide');
        $('#calling').on('hidden.bs.modal', function () {
          // Load up a new modal...
          $('#incoming').modal('show');
        });

        this.cd.detectChanges();
      }
    });
  }

  onCallout_transfer() {
    this.iSend.myEventEmitter.on('callout_transfer', (event: any) => {

      if (event.sender === 'webagent') {
        this.callList[event.callout_transfer_number] = event;
        this.callArray = Object.keys(this.callList);
        console.log(this.callArray);
        console.log(this.callList);
        this.cd.detectChanges();
        $('#numpad').modal('hide');
        $('#numpad').on('hidden.bs.modal', function () {
          // Load up a new modal...
          $('#incoming').modal('show');
        });

        this.cd.detectChanges();
      }
    });
  }

  callout() {
    this.iSend.boardcast({
      action: 'callout',
      callout_number: this.numpad,
      sender: 'icrm',
    });
    this.numpad = '';
  }

  onMic() {
    this.iSend.myEventEmitter.on('mic', (event: any) => {
      if (event.sender === 'webagent') {
        this.callList[event.mic_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.cd.detectChanges();
      }
    });
  }

  onUnMic() {
    this.iSend.myEventEmitter.on('unmic', (event: any) => {
      if (event.sender === 'webagent') {
        this.callList[event.unmic_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.cd.detectChanges();
      }
    });
  }

  onMute() {
    this.iSend.myEventEmitter.on('mute', (event: any) => {
      if (event.sender === 'webagent') {
        this.callList[event.mute_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.cd.detectChanges();
      }
    });
  }

  onUnMute() {
    this.iSend.myEventEmitter.on('unmute', (event: any) => {
      if (event.sender === 'webagent') {
        this.callList[event.unmute_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.cd.detectChanges();
      }
    });
  }

  transfer(number: any) {
    this.iSend.boardcast({
      action: 'transfer',
      transfer_number: number,
      sender: 'icrm',
    });
  }

  callout_transfer() {
    this.iSend.boardcast({
      action: 'callout_transfer',
      callout_transfer_number: this.numpad,
      sender: 'icrm',
    });
    this.numpad = '';
  }

  mic(number: any) {
    this.iSend.boardcast({
      action: 'mic',
      mic_number: number,
      sender: 'icrm',
    });
  }

  unmic(number: any) {
    this.iSend.boardcast({
      action: 'unmic',
      unmic_number: number,
      sender: 'icrm',
    });
  }

  mute(number: any) {
    this.iSend.boardcast({
      action: 'mute',
      mute_number: number,
      sender: 'icrm',
    });
  }

  unmute(number: any) {
    this.iSend.boardcast({
      action: 'unmute',
      unmute_number: number,
      sender: 'icrm',
    });
  }

  onDNDshort() {
    this.iSend.myEventEmitter.on('dndshort', (event: any) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  dndshort() {
    this.iSend.boardcast({
      action: 'dndshort',
      sender: 'icrm',
    });
  }
  onDNDlong() {
    this.iSend.myEventEmitter.on('dndlong', (event: any) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  dndlong() {
    this.iSend.boardcast({
      action: 'dndlong',
      sender: 'icrm',
    });
  }

  onDNDlast() {
    this.iSend.myEventEmitter.on('dndlast', (event: any) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  dndlast() {
    this.iSend.boardcast({
      action: 'dndlast',
      sender: 'icrm',
    });
  }

  onOnline() {
    this.iSend.myEventEmitter.on('online', (event) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  onOffline() {
    this.iSend.myEventEmitter.on('offline', (event) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  online() {
    this.iSend.boardcast({
      action: 'online',
      sender: 'icrm',
    });
  }

  offline() {
    this.iSend.boardcast({
      action: 'offline',
      sender: 'icrm',
    });
  }

  onCreateconference() {
    this.iSend.myEventEmitter.on('createconference', (event: any) => {
      this.callList[event.createconference] = event;
      this.callArray = Object.keys(this.callList);
      console.log(this.callArray);
      this.cd.detectChanges();
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  createconference() {
    this.iSend.boardcast({
      action: 'createconference',
      sender: 'icrm',
    });
  }

  onCreatecomplete() {
    this.iSend.myEventEmitter.on('createcomplete', (event: any) => {
      if (event['sender'] === 'webagent') {
        this.startTimer();
        this.callList[event.createcomplete_number] = event;
        this.state = event['action'];
        this.operationStatus = event['status'];
        this.cd.detectChanges();
      }
    });
  }

  createcomplete() {
    this.iSend.boardcast({
      action: 'createcomplete',
      sender: 'icrm',
    });
  }

  onCreatefalse() {
    this.iSend.myEventEmitter.on('createfalse', (event: any) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
      this.cd.detectChanges();
    });
  }

  createfalse() {
    this.iSend.boardcast({
      action: 'createfalse',
      sender: 'icrm',
    });
  }

  onJoincomplete() {
    this.iSend.myEventEmitter.on('joincomplete', (event: any) => {
      if (event.sender === 'webagent') {
        this.callList[event.joincomplete_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.cd.detectChanges();
      }
    });
  }

  joincomplete(number: any) {
    this.iSend.boardcast({
      action: 'joincomplete',
      joincomplete_number: number,
      sender: 'icrm',
    });
  }

  onHangupconference() {
    this.iSend.myEventEmitter.on('hangupconference', (event :any) => {
      delete this.callList[event.hangupconference_number]
      this.callArray = Object.keys(this.callList)
      this.state = event['action']
      console.log(this.callArray);
      if (Object.keys(this.callList).length == 0) {
          this.state = ''
      }
      this.cd.detectChanges();
    });
  }

  hangupconference(number: any) {
    this.iSend.boardcast({
      action: 'hangupconference',
      hangupconference_number: number,
      sender: 'icrm',
    });
  }

  onCloseconference() {
    this.iSend.myEventEmitter.on('closeconference', (event: any) => {
      if (event['sender'] === 'webagent') {
        this.operationStatus = event['status'];
      }
    });
  }

  closeconference() {
    this.iSend.boardcast({
      action: 'closeconference',
      sender: 'icrm',
    });
  }

  onTransfercomplete() {
    this.iSend.myEventEmitter.on('transfercomplete', (event: any) => {
      delete this.callList[event.hangup_number];
      if (event.sender === 'webagent') {
        this.callList[event.transfercomplete_number] = event;
        this.callArray = Object.keys(this.callList);
        this.state = event['action'];
        console.log(this.callArray);
        this.stopTimer();
      }
      if (!this.isOpenCallPopup) {
        document.getElementById('callingtab').click();
      }
      this.cd.detectChanges();
    });
  }

  transfercomplete(number: any) {
    this.iSend.boardcast({
      action: 'transfercomplete',
      transfercomplete_number: number,
      sender: 'icrm',
    });
  }
}
