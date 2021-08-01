import { Component, OnInit, ViewChild } from '@angular/core';
import { SessionName, AuthService } from '../../core/services/auth.service';
import { PoPageSlideComponent } from '@po-ui/ng-components';

const menuBateu = [
  { icon:'po-icon po-icon-chart-columns', label: 'Visão Geral', link: 'home' },
  { icon:'po-icon po-icon-message', label: 'Mensagens', link: '' },
  { icon:'po-icon po-icon-plus-circle', label: 'Cadastros', link: '/',
    subItems:[
                { label: 'Estabelecimento', link: 'establishment'},
                { label: 'Loja', link: 'shop' },
                { label: 'Marca', link: 'brand' },
                { label: 'Modelo', link: 'model' },
                { label: 'Peça em destaque', link: 'piece/spotlight' },
    ]
  },
  { icon:'po-icon po-icon-settings', label: 'Configurações', link: '/hooks',
    subItems:[
      { label: 'Usuários Logistas', link: 'user/logist'},
      { label: 'Usuários Clientes', link: 'user/client' },
      { label: 'Perfil de Usuário', link: 'user/perfil' },
    ]
  }
];

const menuLogist = [
  { icon:'po-icon po-icon-chart-columns', label: 'Visão Geral', link: 'home' },
  { icon:'po-icon po-icon-message', label: 'Mensagens', link: '' },
  { icon:'po-icon po-icon-plus-circle', label: 'Cadastros', link: '/',
    subItems:[
      { label: 'Peça', link: 'piece'},
    ]
  },
  { icon:'po-icon po-icon-cart', label: 'Orçamento', link: 'budget' },
  { icon:'po-icon po-icon-pushcart', label: 'Cotações', link: 'quotation' }
];

const menuClient = [
  { icon:'po-icon po-icon-chart-columns', label: 'Visão Geral', link: 'home' },
  { icon:'po-icon po-icon-message', label: 'Mensagens', link: '' },
  { icon:'po-icon po-icon-cart', label: 'Cotações', link: 'quotation/client' },
];

import {
  PoMenuItem,
  PoNavbarIconAction,
  PoToolbarAction,
  PoToolbarProfile,
  PoDialogService,
  PoNotificationService
} from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { takeUntil } from 'rxjs/operators';
import { FormComponent } from 'src/app/shared/common';
import { SocketService } from 'src/app/core/services/socket.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent extends FormComponent implements OnInit {
  constructor(
    private poNotification: PoNotificationService,
    private authService: AuthService,
    private notificatioService: NotificationService,
    private router: Router,
    alertService: PoNotificationService,
    private socketService: SocketService
  ) {
    super(alertService);
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
  }

  @ViewChild(PoPageSlideComponent, { static: true }) pageSlide: PoPageSlideComponent;

  public titleNotify = '';

  title: string;

  notificationActions = [];

  profile: PoToolbarProfile = {
    avatar: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fbr.freepik.com%2Fvetores-premium%2Fperfil-de-avatar-de-homem-no-icone-redondo_2651713.htm&psig=AOvVaw0nDyvOZRkKeQOBQvZ_UYXN&ust=1607175539250000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCNiJusu5tO0CFQAAAAAdAAAAABAO',
    subtitle: this.authService.getEmail(),
    title: this.authService.getUsername(),
  };

  profileActions: Array<PoToolbarAction> = [
    { icon: 'po-icon-exit', label: 'Sair', type: 'danger', separator: true, action: item => this.logout() }
  ];

  actions: Array<PoToolbarAction> = [
    { label: 'Start cash register', action: item => this.showAction(item) },
    { label: 'Finalize cash register', action: item => this.showAction(item) },
    { label: 'Cash register options', action: item => this.showAction(item) }
  ];

  // [*AppBar]
  readonly navActions: Array<PoNavbarIconAction> = [
  ];

  // [*MainMenu]
  readonly menus: Array<PoMenuItem> = this.isBateu() ? menuBateu : (this.isClient() ? menuClient : menuLogist);

  ngOnInit(): void {
    Notification.requestPermission(/* opcional: callback */);

    this.title = this.authService.getShopName();

    this.socketService.setupSocketConnection();

    let receptor = '';

    if(this.authService.getShopID() > 0){
      receptor = 'id_loja' + this.authService.getShopID();
    }else{
      receptor = 'id_usuario' + this.authService.getID();
    }

    this.socketService.socket.emit('subscribe', receptor);

    this.socketService.socket.on('observer notify', (dataJson) => {

      const {data} = dataJson.data;

      this.notificationActions.unshift({
        label: data.mensagem,
        type: 'danger',
        icon: 'po-icon-info',
        action: item => this.onClickNotification(item),
        data: data,
      });

      var notification = new Notification("BATEU", {
        icon: '',
        body: data.mensagem,
      });

      notification.onclick = () => {
        this.onClickNotification({data: dataJson.data});
      }
    });

    this.notificatioService.getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        for(let i = 0; i < res.items.length; i++){
          this.notificationActions.push({
            label: res.items[i].mensagem,
            type: res.items[i].is_visualizado == 0 ? 'danger' : '',
            icon: res.items[i].is_visualizado == 0 ? 'po-icon-info' : '',
            action: item => this.onClickNotification(item),
            data: res.items[i],
          });
        }
      });
  }

  private isBateu(): boolean {
    return localStorage.getItem(SessionName.IS_BATEU) === 'true';
  }

  private isClient(): boolean {
    return localStorage.getItem(SessionName.ESTABLISHMENT_ID) === '0' && localStorage.getItem(SessionName.SHOP_ID) === '0';
  }

  getNotificationNumber() {
    return this.notificationActions.filter(not => not.type === 'danger').length;
  }

  onClickNotification(item: any) {
    if((Number(item.data.id_loja))){
      if((Number(item.data.id_cotacao))){
        this.router.navigate(['admin/quotation/' + item.data.id_cotacao]);
      }else if((Number(item.data.id_orcamento))){
        this.router.navigate(['admin/budget/' + item.data.id_orcamento]);
      };

      item.type = '';
      this.notificatioService.viewed(Number(item.data.id))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {

      });
    }else if((Number(item.data.id_usuario))){
      if((Number(item.data.id_cotacao))){
        this.router.navigate(['admin/quotation/' + item.data.id_cotacao]);
      }
      item.type = '';
      this.notificatioService.viewed(Number(item.data.id))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {

      });
    }

    //this.pageSlide.open();
  }

  showAction(item: PoToolbarAction): void {
    this.poNotification.success(`Action clicked: ${item.label}`);
  }

  logout(): void {
    this.authService.logout;
    this.router.navigate(['auth/logout']);
  }
}
