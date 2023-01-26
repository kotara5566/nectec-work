import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TestComponent } from './test.component';
import {InlineSVGModule} from 'ng-inline-svg-2';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule, InlineSVGModule],
    declarations: [TestComponent ],
    exports: [ TestComponent ]
})

export class TestModule {}
