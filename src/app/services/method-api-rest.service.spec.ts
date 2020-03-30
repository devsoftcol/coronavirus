import { TestBed } from '@angular/core/testing';

import { MethodApiRestService } from './method-api-rest.service';

describe('MethodApiRestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MethodApiRestService = TestBed.get(MethodApiRestService);
    expect(service).toBeTruthy();
  });
});
