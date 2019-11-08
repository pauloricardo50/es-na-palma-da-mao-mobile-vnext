

import { Component } from '@angular/core';
import { trackById, AuthQuery } from '@espm/core';
import { IonicPage, NavController } from 'ionic-angular';
import deburr from 'lodash-es/deburr';
import { Concurso } from '../../model';
import { SelecaoQuery, SelecaoService } from '../../providers';
import { Subject } from 'rxjs/Subject';


@IonicPage({
  segment: 'concursos'
})
@Component({
  selector: 'espm-dt-concursos-page',
  templateUrl: 'concursos.html'
})
export class ConcursosPage {

  data=[
    { CPF: '02437333128',
      orgao:'SEDU',
      percentual: 65 },

    { CPF: '01435333128',
      orgao:'SESA',
      percentual: 95 },

    { CPF: '01435355555',
      orgao:'SECTI',
      percentual: 10 }]
  /**
  *
  */
  concursos$: Subject<Concurso[]>; // concursos que são exibidos na tela
  concursosLenght: number;
  allConcursos: Concurso[];
  filteredConcursos: Concurso[];
  trackById = trackById;
  valor = [];
  
  /**
  *
  */
  constructor(private auth: AuthQuery, private navCtrl: NavController, private service: SelecaoService, private query: SelecaoQuery) {
    this.concursos$ = new Subject();

   if (this.auth.isLoggedIn)
    { let cpf = this.auth.state.claims.cpf 
      for(let i = 0; i < this.data.length; i++){
        if(cpf === this.data[i].CPF){ 
          this.valor[i] = this.data[i].orgao
         
        }
      }
    }
    console.log(this.valor)
  }
  
  /**
  *
  */
  verificationOrgan(){
  
}
  
  ionViewWillLoad() {
    this.query
    .selectAll()
    .subscribe((concursos: Concurso[]) => {
      this.allConcursos = concursos;
      this.updateConcursos(concursos);
    });
    
    // carrega dados
    this.service.loadAll();
  }
  /**
  *
  */
  private updateConcursos = (concursos: Concurso[]) => {
    this.concursos$.next(
      this.sortByFavorites(concursos)
    );
    this.concursosLenght = concursos.length;
  };

  private sortByFavorites = (concursos: Concurso[]): Concurso[] => {
    const favorites: Concurso[] = concursos.filter((concurso: Concurso) => concurso.favorito);
    const noFavorites: Concurso[] = concursos.filter((concurso: Concurso) => !concurso.favorito);
    return favorites.concat(noFavorites);
  }
  
  /**
  *
  */
  search = e => {
    const search = this.normalize(e.target.value);
    
    // se o texto da pesquisa estiver vazio, exibe tudo
    if (search.length === 0) this.updateConcursos(this.allConcursos);
    
    // artibui o resultado da busca ao Subject de concursos
    this.updateConcursos(
      // efetivamente faz a busca      
      this.filteredConcursos = this.allConcursos.filter(concurso => {
        return this.normalize(concurso.orgao).includes(search) || this.normalize(concurso.descricao).includes(search);
      })
    );
  };
  /**
  *  volta para pagina de apresentação
  */
  backPageOne() {
    this.navCtrl.push('Apresentacao')
  }
  /**
  *
  */
  clear = () => {
    this.filteredConcursos = [...this.allConcursos];
  };
  
  /**
  *
  */
  showDetails(id) {
    this.navCtrl.push('ConcursoPage', { id });
  }
  
  // tamanho do nome "orgão" limitado 
  limite = (valor) => {
    if (valor.length > 12) {
      return valor.substring(0, 12)+"…";
    } else {
      return valor;
    }
  }
  
  /**
  *
  */
  private normalize = (term: string) => (term ? deburr(term.toLowerCase()) : '');
}
