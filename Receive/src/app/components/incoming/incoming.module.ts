import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IncomingComponent } from './incoming.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [RouterModule, CommonModule, FormsModule, InlineSVGModule,ReactiveFormsModule],
  declarations: [IncomingComponent],
  exports: [IncomingComponent],
})
export class IncomingModule {}
