import { Injectable, inject, signal } from '@angular/core';
import { UsersStore } from '../../../store/users/users.service';
import { DialogService } from '../dialog.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserPayload } from '../../../store/users/interfaces/users';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = inject(UsersStore);
  dialog = inject(DialogService);

  mode = signal('create' as 'create' | 'edit');
  id = signal('');

  formGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });

  create() {
    const email = this.formGroup.get('email')?.value || '';
    const isUnique = this.users.users().some((user) => user.email === email);
    if (!isUnique) {
      this.users.add({ ...this.formGroup.value, role: 'admin' } as UserPayload);
      this.dialog.closeDialog();
      this.formGroup.reset();
    }
  }

  edit() {
    this.users.edit(this.id(), { ...this.formGroup.value, role: 'admin' } as UserPayload);
    this.dialog.closeDialog();
    this.formGroup.reset();
  }
}
