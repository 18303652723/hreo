import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CashWithdrawRecordComponent } from './cash-withdraw-record.component';

describe('CashWithdrawRecordComponent', () => {
  let component: CashWithdrawRecordComponent;
  let fixture: ComponentFixture<CashWithdrawRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashWithdrawRecordComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CashWithdrawRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
