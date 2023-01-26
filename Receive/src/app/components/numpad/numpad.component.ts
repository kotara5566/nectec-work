import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ISendServiceService } from '../../services/iSend-service/iSend-service.service';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
})
export class NumpadComponent implements OnInit {
  isOpenCallPopup = false;
  toolbarcalloutClass = 'symbol-30px symbol-md-40px';
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-60px h-60px w-md-60px h-md-60px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  numpad = '';
  callList: any = {};
  state = '';
  callArray: any = [];

  constructor(
    private iSend: ISendServiceService,
    private cd: ChangeDetectorRef
  ) {

  }

  deleteNumber() {
    this.numpad = this.numpad.slice(0, -1);
  }

  onCkickNumPad(key: any) {
    this.numpad += key;
  }

  ngOnInit(): void {}



  callout() {
    this.iSend.boardcast({
      action: 'callout',
      callout_number: this.numpad,
      sender: 'icrm',
    });
    this.numpad = '';
  }

  transfer() {
    this.iSend.boardcast({
      action: 'callout',
      callout_number: this.numpad,
      sender: 'icrm',
    });
    this.numpad = '';
  }
}
