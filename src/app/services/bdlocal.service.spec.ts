import { TestBed } from '@angular/core/testing';
import { BdlocalService } from './bdlocal.service';

describe('Bdlocal', () => {
  let service: BdlocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdlocalService );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
