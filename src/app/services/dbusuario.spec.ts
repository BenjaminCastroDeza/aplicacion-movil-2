import { TestBed } from '@angular/core/testing';

import { Dbusuario } from './dbusuario';

describe('Dbusuario', () => {
  let service: Dbusuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dbusuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
