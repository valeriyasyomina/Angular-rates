import { TestBed, inject } from '@angular/core/testing';

import { RatesService } from './rates.service';

describe('RatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RatesService]
    });
  });

  it('should be created', inject([RatesService], (service: RatesService) => {
    expect(service).toBeTruthy();
  }));
});
