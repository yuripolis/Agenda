import { Component, OnInit } from '@angular/core';
import { ViaCepService } from './via-cep.service';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h1>ViaCEP Data</h1>
      <div>
        <label for="cep">Enter CEP: </label>
        <input type="text" id="cep" (input)="onCepInput($event)" />
      </div>
      <div *ngIf="cepData">
        <h2>CEP Data:</h2>
        <pre>{{ cepData | json }}</pre>
      </div>
      <div *ngIf="error">
        <p style="color: red;">{{ error }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cep: string = '';
  cepData: any;
  error: string | null = null;
  private cepSubject = new Subject<string>();

  constructor(private viaCepService: ViaCepService) { }

  ngOnInit() {
    this.cepSubject.pipe(
      debounceTime(300),
      switchMap(cep =>
        this.viaCepService.getCepData(cep).pipe(
          catchError(err => {
            this.cepData = null;
            this.error = err.message;
            return of(this.error);  
          })
        )
      )
    ).subscribe({
      next: data => {
        if (data) {
          this.cepData = data;
          this.error = null;
        }
      },
      complete: () => console.log('Complete')
    });
  }

  onCepInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.cepSubject.next(input.value);
    }
  }
}
