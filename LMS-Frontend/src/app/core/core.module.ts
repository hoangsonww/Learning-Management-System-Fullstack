import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [LoginComponent, NavbarComponent, FooterComponent],
  imports: [CommonModule, HttpClientModule, FormsModule],
  exports: [NavbarComponent, FooterComponent],
  providers: [AuthGuard],
})
export class CoreModule {}
