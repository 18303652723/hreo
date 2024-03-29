import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TotalComponent } from './total.component';

describe('TotalComponent', () => {
  let component: TotalComponent;
  let fixture: ComponentFixture<TotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
