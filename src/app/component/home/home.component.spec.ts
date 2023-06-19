import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { TokenDecoderService } from 'src/app/service/token-decoder/token-decoder.service';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let localStorageService: jasmine.SpyObj<LocalStorageService>;
  let router: jasmine.SpyObj<Router>;
  let tokenDecoderService: jasmine.SpyObj<TokenDecoderService>;

  beforeEach(() => {
    const localStorageSpy = jasmine.createSpyObj('LocalStorageService', [
      'isLoggedIn',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const tokenDecoderSpy = jasmine.createSpyObj('TokenDecoderService', [
      'getUsernameFromToken',
    ]);

    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TokenDecoderService, useValue: tokenDecoderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(
      LocalStorageService
    ) as jasmine.SpyObj<LocalStorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    tokenDecoderService = TestBed.inject(
      TokenDecoderService
    ) as jasmine.SpyObj<TokenDecoderService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to the register page', () => {
    component.goToRegisterPage();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it('should check if the user is logged in', () => {
    localStorageService.isLoggedIn.and.returnValue(true);
    const isLoggedIn = component.isLoggedIn();
    expect(localStorageService.isLoggedIn).toHaveBeenCalled();
    expect(isLoggedIn).toBe(true);
  });
});
