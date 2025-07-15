import { describe, expect, test } from "vitest";
import { store } from "../store";

describe('Redux Store', () => {
  test('auth slice initial state should be idle', () => {    
    expect(store.getState().auth.status).toBe('idle');
  })
});