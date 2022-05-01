import { Component, ElementRef, Input, ViewChild, EventEmitter, AfterViewInit, OnInit, HostListener, Renderer2, Output } from '@angular/core';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { Instrument} from 'src/app/models/instrument.model';

@Component({
  selector: 'app-layer-edit',
  templateUrl: './layer-edit.component.html',
  styleUrls: ['./layer-edit.component.scss']
})
export class LayerEditComponent implements OnInit, AfterViewInit {

  @ViewChild('dragPlane') elementView!: ElementRef;
  @ViewChild('pie') pie!: ElementRef;


  @Input() instrument = new Instrument;
  @Input() spin: boolean = false;
  @Input() solo: boolean = false;
  @Input() editing: boolean = false;
  @Input() instrumentChange = new EventEmitter<Instrument>();
  @Input() clearAll = new EventEmitter();
  @Output() editActive = new EventEmitter();
  @Output() soloActive = new EventEmitter();
  @Output() notesChanged = new EventEmitter();

  tempos = [1,2,3]
  top: number = 0;
  left: number = 0;
  resized: boolean = false;
  clear = new EventEmitter();


  @HostListener('window:resize', ['$event'])
  onResize(event: any){
    this.resized = true;
  }

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.instrumentChange.subscribe(i => {
      this.setPosition(i.pitch, i.fade);
    });
    this.clearAll.subscribe(i => {
      this.clear.emit();
    });
  }

  ngAfterViewInit() {
    this.setPosition(this.instrument.pitch, this.instrument.fade);
  }

  
  changeTempo(t: number) {
    this.instrument.tempo = t;
  }

  changeVolume(event: any) {
    this.instrument.volume = event.target.value * 10;
  }

  editToggle() {
    this.editing = !this.editing;
    this.editActive.emit();
  }

  soloToggle() {
    this.solo = !this.solo;
    this.soloActive.emit();
  }

  setPosition(pitch: number, fade: number) {
    var plane = this.elementView.nativeElement.getBoundingClientRect();
    this.top = (1 - pitch / 10) * plane.height;
    this.left = fade / 10 * plane.width;
    var transform = 'translate3d(' + this.left + 'px, ' + this.top + 'px, 0px)'
    this.renderer.setStyle(this.pie.nativeElement, 'transform', transform);
  }

  getPosition() {
    var transform = getComputedStyle(this.pie.nativeElement).getPropertyValue('transform');
    var tList = transform.split(/[ ,]+/);
    var x = parseFloat(tList[4])
    var y = parseFloat(tList[5].slice(0,-1))
    return {'x': x, 'y': y}
  }

  dragStart($event: CdkDragStart) {
    if (this.resized) {
      this.setPosition(this.instrument.pitch, this.instrument.fade);
      this.resized = false;
    }
  }

  dragEnd($event: CdkDragEnd) {
    var piePos = this.getPosition();
    var plane = this.elementView.nativeElement.getBoundingClientRect();

    this.instrument.fade = Math.round(piePos.x/plane.width * 10) 
    this.instrument.pitch = Math.round(10-piePos.y/plane.height * 10) 

    // console.log("Pitch: " + this.instrument.pitch);
    // console.log("Fade: " + this.instrument.fade);
  }
}
