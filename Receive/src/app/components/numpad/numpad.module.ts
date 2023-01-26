import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NumpadComponent } from './numpad.component';
import {InlineSVGModule} from 'ng-inline-svg-2';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule, InlineSVGModule],
    declarations: [NumpadComponent ],
    exports: [ NumpadComponent ]
})

export class NumpadModule {}
