import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Http, XHRBackend, ConnectionBackend, RequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { ShellComponent } from './shell/shell.component';
import { HeaderComponent } from './shell/header/header.component';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { UserService } from '../profile/user.service';

export function getToken(){
  return localStorage.getItem('access_token');
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken,
        whitelistedDomains: ['localhost:8080', 'lamikvah.org', 'mikvah.website', 'test.mikvah.wesite']
      }
    })
  ],
  declarations: [
    HeaderComponent,
    ShellComponent
  ],
  providers: [
    AuthenticationService,
    UserService,
    AuthenticationGuard
  ]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    // Import guard
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import Core module in the AppModule only.`);
    }
  }

}
