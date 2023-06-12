import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { CustomResponse } from '../../interface/custom-response';
import { UserService } from '../../service/user.service';
import { AppState } from 'src/app/interface/app-state';
import { DataState } from 'src/app/enum/data-state.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  appState$: Observable<AppState<CustomResponse>>;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.appState$ = this.userService.users$.pipe(
      map((response) => {
        return { dataState: DataState.LOADED_STATE, appData: response };
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error: error });
      })
    );
  }
}
