import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ViaCepService {
  private apiUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) { }

  getCepData(cep: string): Observable<ViaCepResponse> {
    return this.http.get<ViaCepResponse>(`${this.apiUrl}${cep}/json/`).pipe(
      map(data => {
        if (data.erro) {
          throw new Error('Invalid CEP');
        }
        return data;
      }),
      catchError(error => {
        console.error('Error fetching data:', error);
        return throwError(error);
      })
    );
  }
}
