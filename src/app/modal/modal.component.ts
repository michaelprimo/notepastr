import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() isVisible_cancel: boolean = false;
  @Input() isVisible_cancelList: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>(); // Evento per confermare la cancellazione

  closeModal_cancel() {
    this.isVisible_cancel = false;
    this.close.emit();
  }

  closeModal_cancelList() {
    this.isVisible_cancelList = false;
    this.close.emit();
  }

  // Metodo per confermare la cancellazione e chiudere il modale
  confirmAndClose() {
    this.confirmDelete.emit(); // Emetti l'evento
    this.closeModal_cancel();
  }
}