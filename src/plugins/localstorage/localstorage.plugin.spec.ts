import { TestBed } from '@angular/core/testing';

import { NgxsModule, LocalStoragePluginModule, State, Action, Store } from 'ngxs';

describe('LocalStoragePlugin', () => {
  let store: Store;

  class Increment {}

  class Decrement {}

  interface StateModel {
    count: number;
  }

  @State<StateModel>({
    name: 'counter',
    defaults: { count: 0 }
  })
  class MyStore {
    @Action(Increment)
    increment({ state, setState }) {
      setState({
        count: Number(state.count) + 1
      });
    }

    @Action(Decrement)
    decrement({ state, setState }) {
      setState({
        count: Number(state.count) - 1
      });
    }
  }

  beforeEach(() => {
    localStorage.setItem('@@STATE', JSON.stringify({ counter: { count: 100 } }));

    TestBed.configureTestingModule({
      imports: [LocalStoragePluginModule.forRoot(), NgxsModule.forRoot([MyStore])]
    });

    store = TestBed.get(Store);
  });

  afterEach(() => {
    localStorage.removeItem('@@STATE');
  });

  it('should get initial data from localstorage', () => {
    localStorage.setItem('@@STATE', JSON.stringify({ counter: { count: 100 } }));

    store.select(state => state.counter).subscribe((state: StateModel) => {
      expect(state.count).toBe(100);
    });
  });

  it('should save data to localstorage', () => {
    store.dispatch(new Increment());
    store.dispatch(new Increment());
    store.dispatch(new Increment());
    store.dispatch(new Increment());
    store.dispatch(new Increment());

    store.select(state => state.counter).subscribe((state: StateModel) => {
      expect(state.count).toBe(105);

      expect(localStorage.getItem('@@STATE')).toBe(JSON.stringify({ counter: { count: 105 } }));
    });
  });
});
