import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './login/register/register.component';
import { PersonalityComponent } from './components/main/personality/personality.component';
import { ChangepasswordComponent } from './components/main/changepassword/changepassword.component';
import { GoogleGuard } from './service/google.guard';
import { YourpictureComponent } from './components/main/yourpicture/yourpicture.component';
import { WelcomeComponent } from './login/welcome/welcome.component';
import { RankvoteComponent } from './components/main/rankvote/rankvote.component';

export const routes: Routes = [
    
    { path: '', component: WelcomeComponent },
    { path: 'signin', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'main', component: MainComponent, canActivate: [GoogleGuard] },
    { path: 'main/profile', component: PersonalityComponent, canActivate: [GoogleGuard] },
    { path: 'main/changepassword', component: ChangepasswordComponent, canActivate: [GoogleGuard] },
    { path: 'main/yourpicture', component: YourpictureComponent, canActivate: [GoogleGuard] },
    { path: 'main/rank', component: RankvoteComponent, canActivate: [GoogleGuard] },

];
