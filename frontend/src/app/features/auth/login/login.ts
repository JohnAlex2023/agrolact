import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Logo } from '../../../shared/logo/logo';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Logo],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.authService.login(email, password).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.message ?? 'No se pudo iniciar sesion');
      },
    });
  }
}
