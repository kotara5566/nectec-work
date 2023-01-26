import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  isIncoming = false;
  callList: any = {};
  state = '';
  callArray: any = [];
  operationStatus = 'online';
  numpad = '';
  call: any = 'incoming_number';
  actionNameList: any = {'incoming': 'สายเข้า', 'answer': 'กำลังสนทนา', 'hangup': 'วางสาย'}
  isOpenCallPopup = false

  constructor() {

  }

  ngOnInit(): void {

  }
  
}
