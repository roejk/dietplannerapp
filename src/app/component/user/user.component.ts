import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../../service/user/user.service';
import { User } from 'src/app/service/user/user.types';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  displayedColumns: string[] = [
    'userId',
    'username',
    'email',
    'role',
    'isLocked',
    'isEnabled',
  ];
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.users$.subscribe((x) => (this.dataSource.data = x));
  }
}
