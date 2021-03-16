import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfirmDialogService } from 'src/app/service/confirm-dialog.service';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  filter: string = '';
  sortColumn:string = '';
  users$: Observable<User[]> = this.userService.getAll();

  constructor(
    private userService: UserService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit(): void {
  }

  onSearch(filter: string) {
    this.filter = filter;
    this.updateUsers();
  }

  onColumnSelect(key: string): void {
    this.sortColumn = key;
    this.updateUsers();
  }

  onConfirmDelete(userId: number) {
    this.confirmDialogService.confirmThis(
      "Are you sure to delete User?",
      () => {
        this.onDelete(userId);
      }, () => { })
  }

  onDelete(userId: number) {
    this.userService.delete(userId).subscribe(
      () => this.updateUsers()
    );
  }

  updateUsers() {
    this.users$ = this.userService.getUsers(
      this.filter, this.sortColumn);
  }
}
