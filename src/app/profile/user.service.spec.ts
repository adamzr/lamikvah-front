import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';

import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  beforeEach(inject([
    UserService,
    MockBackend
  ], (_userService: UserService,
      _mockBackend: MockBackend) => {

    userService = _userService;
    mockBackend = _mockBackend;
  }));

  afterEach(() => {
    mockBackend.verifyNoPendingRequests();
  });

  describe('getRandomQuote', () => {
    it('should return a random Chuck Norris quote', fakeAsync(() => {
      // Arrange
      const mockQuote = 'a random quote';
      const response = new Response(new ResponseOptions({
        body: { value: mockQuote }
      }));
      mockBackend.connections.subscribe((connection: MockConnection) => connection.mockRespond(response));

      // Act
      const randomQuoteSubscription = userService.getRandomQuote({ category: 'toto' });
      tick();

      // Assert
      randomQuoteSubscription.subscribe((quote: string) => {
        expect(quote).toEqual(mockQuote);
      });
    }));

    it('should return a string in case of error', fakeAsync(() => {
      // Arrange
      const response = new Response(new ResponseOptions({ status: 500 }));
      mockBackend.connections.subscribe((connection: MockConnection) => connection.mockError(response as any));

      // Act
      const randomQuoteSubscription = userService.getRandomQuote({ category: 'toto' });
      tick();

      // Assert
      randomQuoteSubscription.subscribe((quote: string) => {
        expect(typeof quote).toEqual('string');
        expect(quote).toContain('Error');
      });
    }));
  });
});
