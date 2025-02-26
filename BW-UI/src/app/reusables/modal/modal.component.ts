import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() multipage: boolean = false;

  page: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    return;
  }

}
