import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BeatWheelComponent } from './beat-wheel/beat-wheel.component';
import { BeatLayerComponent } from './beat-wheel/beat-layer/beat-layer.component';
import { LayerEditComponent } from './beat-wheel/layer-edit/layer-edit.component';
import { NoteEditComponent } from './beat-wheel/layer-edit/note-edit/note-edit.component';
import { BarViewComponent } from './beat-wheel/layer-edit/bar-view/bar-view.component';
import { ModalComponent } from './reusables/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    BeatWheelComponent,
    BeatLayerComponent,
    LayerEditComponent,
    NoteEditComponent,
    BarViewComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
