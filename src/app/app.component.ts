import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly user$ = this.authService.user$;

  constructor(
    private authService: AuthService,
    private router: Router,
    readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeService.init();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
