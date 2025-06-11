import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  private http = inject(HttpClient);

  fetchCsrfToken() {
    // Call the CSRF API endpoint (adjust URL as needed)
    this.http.get('/v1/api/csrf-token', { observe: 'response' }).subscribe(resp => {
    const token = resp.headers.get('X-CSRF-TOKEN');
      if (token) {
        sessionStorage.setItem('X-CSRF-TOKEN', token);
      }
    });
  }
}
