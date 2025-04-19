import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddParcelaPage } from './add-parcela.page';

describe('AddParcelaPage', () => {
  let component: AddParcelaPage;
  let fixture: ComponentFixture<AddParcelaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddParcelaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
