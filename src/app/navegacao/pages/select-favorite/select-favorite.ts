import { Component, OnDestroy, OnInit} from '@angular/core';
import { IonicPage, App, NavController } from 'ionic-angular';
import { AuthQuery } from '@espm/core';
import { AuthNeededService } from '@espm/core/auth/auth-needed.service';
import { ItemMenu } from '../../models';
import { MenuService } from '../../providers/menu.service';
import { Subject } from 'rxjs/Subject';
import { MenusQuery } from '../../providers';
import { takeUntil, tap } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-select-favorite',
  templateUrl: 'select-favorite.html'
})
export class SelectFavoritePage implements OnDestroy, OnInit {
  private destroyed$ = new Subject();

  allChecked: boolean = false;
  menus: ItemMenu[];

  headerContent: Array<string> = ['Selecione os', 'seus serviços', 'favoritos'];

  constructor(
    protected appCtrl: App,
    protected authQuery: AuthQuery,
    protected authNeeded: AuthNeededService,
    protected navCtrl: NavController,
    private menuService: MenuService,
    private menusQuery: MenusQuery
  ) {
   
  }
  /**
   * 
   */
  ngOnInit() {
    this.menusQuery.menus$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((menus) => this.menus = menus);

  this.menusQuery.favorites$
    .pipe(
      takeUntil(this.destroyed$),
      tap((favorites) => this.allChecked = favorites.length === this.menus.length)
    )
    .subscribe()
  }

  /**
   * Marca um menu como favorito
   */
  markItem(itemId: number, itemCheck: boolean) {
    this.menuService.updateMenu(itemId, !itemCheck);
  }

  /**
   *
   */
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * marcar e desmarcar todos os checkbox
   */
  toggleAll() {
    this.menuService.updateAll(this.allChecked);
  }

  /**
   *
   */
  back() {
    this.navCtrl.setRoot('MyServicesPage');
  }
}
