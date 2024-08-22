import { Component, OnInit } from '@angular/core';

// Creiamo la base delle nostre note.
interface Todo {
  id: number;
  note: string;  
}

//Creiamo la base della lista di liste
interface NoteList 
{
  list_id: number;
  name: string;
  noteData: Todo[];
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})

export class TodoComponent implements OnInit {
  //Variabile per immagazzinare liste di liste.
  noteLists: NoteList[] = 
  [
    {
      list_id: 0,
      name: "La mia prima lista",
      noteData: [
        { id: 1, note: "La mia prima nota" }
      ]
    },
    {
      list_id: 1,
      name: "Cestino",
      noteData: [
        { id: 1, note: "La mia prima nota cestinata" }
      ]
    }
  ];
  //l'ID che rappresenta l'indice dell'array della lista attuale in Notelists.
  current_list: number = 0;
  //il contenuto principale della nota creata dall'utente.
  newNote: string = '';
  //il contenuto principale del template per le note create dall'utente.
  newNoteTemplate: string = '';
  //Il nuovo nome della lista creata dall'utente.
  newList: string = '';
  // ID della nota che stiamo modificando
  editNoteId: number | null = null;
  // ID della lista di note che stiamo modificando
  editNoteListId: number | null = null; 
  // Testo della nota che stiamo modificando
  editNoteText: string = '';
  // Testo del nome della lista che stiamo modificando
  editNameNoteText: string = '';
   
  // Variabile per tracciare l'ordine di ordinamento
  isAscendingOrder: boolean = false;
  // Variabile per tracciare l'ordine alfabetico
  isAlphabeticalOrder: boolean = false;
  // Gestisce la visibilità del modale per cancellare una nota
  isModalVisible_cancel: boolean = false;
  // Gestisce la visibilità del modale per cancellare una lista di note
  isModalVisible_cancelList: boolean = false;
  // Contiene l'ID della nota da eliminare
  noteIdToDelete: number | null = null;

  openModal_cancel(id: number) 
  {
    this.isModalVisible_cancel = true;
    this.noteIdToDelete = id; 
  }

  closeModal_cancel() {
    this.isModalVisible_cancel = false;
    this.noteIdToDelete = null;
  }

  openModal_cancelList() 
  {
    this.isModalVisible_cancelList = true;
  }

  closeModal_cancelList() {
    this.isModalVisible_cancelList = false;
  }

  //carichiamo tutte le informazioni presenti in LocalStorage appena viene caricato.
  ngOnInit() 
  {
    this.loadTodos();
  }

  addListNote() {
    if (this.newList.trim() !== '') {
      const newNoteList: NoteList = {
        list_id: Date.now(),
        name: this.newList,
        noteData: [] // Inizializza come array vuoto
      };
      
      this.noteLists.push(newNoteList);
      this.newList = ''; // Reset del campo input
      this.saveTodos();
    }
  }
  //aggiungi una nota nel LocalStorage e nella variabile che contiene le informazioni da visualizzare a schermo.
  addNote() {
    //verifichiamo se l'utente ha inserito in almeno dei due campi una stringa valida da aggiungere alla lista
    if (this.newNote.trim() !== '' || this.newNoteTemplate.trim() !== '') {
      //creiamo le informazioni della nota da inserire in lista grazie all'interfaccia Todo
      const newTodo: Todo = {
        id: Date.now(),
        note: this.newNoteTemplate + this.newNote
      };
      //inseriamo i dati
      this.noteLists[this.current_list].noteData.push(newTodo);
      //svuotiamo il campo
      this.newNote = '';
      //salviamo i dati
      this.saveTodos();
    }
  }

  //questa funzione genera un nuovo array senza la nota con l'id passato e salva la cancellazione di essa.
  deleteNote() 
  {
    if(this.noteIdToDelete !== null)
    {
      this.noteLists[this.current_list].noteData = this.noteLists[this.current_list].noteData.filter(todo => todo.id !== this.noteIdToDelete);
      this.saveTodos();
    }
    
  }

  //questa funzione genera un nuovo array senza la lista con l'id passato e salva la cancellazione di essa.
  deleteNoteList() 
  {
    
    if(this.current_list !== null)
    {
      let list_idToDelete : number = this.noteLists[this.current_list].list_id;
      this.noteLists = this.noteLists.filter(todo => todo.list_id !== list_idToDelete);
      this.current_list = -1;
      this.saveTodos();
    }
  }

  //settiamo il necessario per modificare l'interfaccia e modificare una nota dopo averla immessa
  editNote(todo: Todo) {
    
    this.editNoteId = todo.id;
    this.editNoteText = todo.note;
  }

  //indica che stiamo modificando una lista settando l'id di essa.
  editNameList()
  {
    this.editNoteListId = this.current_list;
  }

  confirmNameList()
  {
    this.noteLists[this.current_list].name = this.editNameNoteText;
    this.cancelEditNameList();
    this.editNameNoteText = "";
    this.saveTodos();
  }

  cancelEditNameList()
  {
    this.editNoteListId = null;
    this.editNameNoteText = "";
  }

  //salviamo una nota in LocalStorage
  saveNote() {
    if (this.editNoteId !== null) {
      const todo = this.noteLists[this.current_list].noteData.find(todo => todo.id === this.editNoteId);
      if (todo) {
        todo.note = this.editNoteText;
        this.saveTodos();
      }
      this.editNoteId = null;
      this.editNoteText = '';
    }
  }

  //funzione che prende l'id della lista nella quale vogliamo operare dal bottone premuto dall'utente
  changeListId(id: number)
  {
    //imposta la variabile convertendo l'id della lista con l'indice dove si trova l'id passato (se presente)
    this.current_list = this.noteLists.findIndex(list => list.list_id === id);
    
    //verifichiamo la effettiva presenza anche con un check con console.log
    if (this.current_list !== -1) 
    {
        console.log(`La lista è alla posizione: ${this.current_list}`);
    } else 
    {
        console.log('Lista non trovata');
    }

  }

  sortNoteAscending()
  {
    // Ordina le note in base alla variabile isAscendingOrder
    if (this.isAscendingOrder) {
      this.noteLists[this.current_list].noteData.sort((a, b) => a.id - b.id);
    } else {
      this.noteLists[this.current_list].noteData.sort((a, b) => b.id - a.id);
    }

    // Inverti lo stato per la prossima chiamata
    this.isAscendingOrder = !this.isAscendingOrder;
  }

  sortNoteAlphabetically() {
    // Ordina le note in base alla variabile isAlphabeticalOrder
    if (this.isAlphabeticalOrder) {
      this.noteLists[this.current_list].noteData.sort((a, b) => a.note.localeCompare(b.note));
    } else {
      this.noteLists[this.current_list].noteData.sort((a, b) => b.note.localeCompare(a.note));
    }
  
    // Inverti lo stato per la prossima chiamata
    this.isAlphabeticalOrder = !this.isAlphabeticalOrder;
  }

  copyToClipboard(note: string) {
    navigator.clipboard.writeText(note).then(
      () => console.log('Testo copiato con successo!'),
      (err) => console.error('Errore nella copia del testo: ', err)
    );
  }

  saveTodos() {
    //salviamo i dati
    localStorage.setItem('noteLists', JSON.stringify(this.noteLists));
  }

  loadTodos() {
    //variabile dove raccogliamo i dati
    const savedNoteLists = localStorage.getItem('noteLists');
   
    if (savedNoteLists) {
      this.noteLists = JSON.parse(savedNoteLists);
    }
  }
}