// data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private data = new BehaviorSubject<string>('Online');
  currentData = this.data.asObservable();

  constructor() { }

  updateData(newData: string) {
    this.data.next(newData);
  }
}
