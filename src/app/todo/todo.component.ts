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
  //il vecchio e attuale metodo per immagazzinare tutte le note in una lista unica
  todos: Todo[] = [];
  //il futuro metodo per immagazzinare liste di liste. Ho inserito un template iniziale.
  noteLists: NoteList[] = [
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
  //l'ID che rappresenta la lista attuale. Attualmente non avrà un utilizzo, ma lo avrà il più presto possibile.
  current_list: number = 1;
  //il contenuto principale della nota creata dall'utente.
  newNote: string = '';
  //il contenuto principale del template per le note create dall'utente.
  newNoteTemplate: string = '';
  // ID della nota che stiamo modificando
  editNoteId: number | null = null; 
  // Testo della nota che stiamo modificando
  editNoteText: string = ''; 
  // Variabile per tracciare l'ordine di ordinamento
  isAscendingOrder: boolean = false;
  // Variabile per tracciare l'ordine alfabetico
  isAlphabeticalOrder: boolean = false;

  //carichiamo tutte le informazioni presenti in LocalStorage appena viene caricato.
  ngOnInit() 
  {
    this.loadTodos();
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
      //vecchio e attuale metodo per inserire i dati
      this.todos.push(newTodo);
      //futuro metodo per inserire i dati
      this.noteLists[this.current_list].noteData.push(newTodo);
      //svuotiamo il campo
      this.newNote = '';
      //salviamo i dati
      this.saveTodos();
    }
  }

  //questa funzione genera un nuovo array senza la nota con l'id passato e salva la cancellazione di essa.
  deleteNote(id: number) {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  //settiamo il necessario per modificare l'interfaccia e modificare una nota dopo averla immessa
  editNote(todo: Todo) {
    this.editNoteId = todo.id;
    this.editNoteText = todo.note;
  }

  //salviamo una nota in LocalStorage
  saveNote() {
    if (this.editNoteId !== null) {
      const todo = this.todos.find(todo => todo.id === this.editNoteId);
      if (todo) {
        todo.note = this.editNoteText;
        this.saveTodos();
      }
      this.editNoteId = null;
      this.editNoteText = '';
    }
  }

  sortNoteAscending()
  {
    // Ordina le note in base alla variabile isAscendingOrder
    if (this.isAscendingOrder) {
      this.todos.sort((a, b) => a.id - b.id);
    } else {
      this.todos.sort((a, b) => b.id - a.id);
    }

    // Inverti lo stato per la prossima chiamata
    this.isAscendingOrder = !this.isAscendingOrder;
  }

  sortNoteAlphabetically() {
    // Ordina le note in base alla variabile isAlphabeticalOrder
    if (this.isAlphabeticalOrder) {
      this.todos.sort((a, b) => a.note.localeCompare(b.note));
    } else {
      this.todos.sort((a, b) => b.note.localeCompare(a.note));
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
    localStorage.setItem('todos', JSON.stringify(this.todos));
    localStorage.setItem('noteLists', JSON.stringify(this.noteLists));
  }

  loadTodos() {
    //variabile corrente dove ci sono i dati
    const savedTodos = localStorage.getItem('todos');
    //variabile futura dove raccoglieremo i dati
    const savedNoteLists = localStorage.getItem('noteLists');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
    if (savedNoteLists) {
      this.noteLists = JSON.parse(savedNoteLists);
    }
  }
}
