import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministracionParcelasPage } from './administracion-parcelas.page';

describe('AdministracionParcelasPage', () => {
  let component: AdministracionParcelasPage;
  let fixture: ComponentFixture<AdministracionParcelasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionParcelasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
