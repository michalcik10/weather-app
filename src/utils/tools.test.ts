import { parseCities, toDate } from './tools';

describe('parseCities', () => {
  test('splits by comma and trims spaces', () => {
    expect(parseCities('Bratislava, Kosice ,Presov')).toEqual(['Bratislava', 'Kosice', 'Presov']);
  });

  test('skips empty entries', () => {
    expect(parseCities('Bratislava,, ,Kosice,')).toEqual(['Bratislava', 'Kosice']);
  });

  test('removes duplicates case-insensitively', () => {
    expect(parseCities('Praha, praha, PRAHA')).toEqual(['Praha']);
  });

  test('returns an empty list for empty input', () => {
    expect(parseCities('  ')).toEqual([]);
  });
});

test('toDate formats the given date', () => {
  expect(toDate(new Date(2026, 10, 25))).toBe('Wednesday 25 November');
});
