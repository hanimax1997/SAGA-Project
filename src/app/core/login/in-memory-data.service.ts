import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { LOGINS } from './login-mock';
import { garanties_liste } from '../models/garanties-mock';
import { sous_garanties_liste } from '../models/sous-garanties-mock';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService{

  createDb() {
    const logins = LOGINS
    const garanties = garanties_liste
    const sousgaranties = sous_garanties_liste

    return {logins, garanties, sousgaranties};
  }
}
