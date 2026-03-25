import type { Quote } from '../store/appData'

export const BUILTIN_QUOTES: Quote[] = [
  {
    id: 'quote_marcus',
    text: '把注意力收回到你能决定的部分，秩序会重新出现。',
    author: 'Marcus Aurelius',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'quote_zhuangzi',
    text: '虚室生白，吉祥止止。',
    author: '庄子',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'quote_nietzsche',
    text: '拥有为何而活的人，几乎可以承受任何生活方式。',
    author: 'Friedrich Nietzsche',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'quote_simone',
    text: '专注不是紧张地盯住一件事，而是让心安静到能真正看见它。',
    author: 'Simone Weil',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'quote_wangyangming',
    text: '知是行之始，行是知之成。',
    author: '王阳明',
    enabled: true,
    source: 'builtin',
  },
  {
    id: 'quote_jobs',
    text: 'Simplicity is the ultimate sophistication.',
    author: 'Steve Jobs',
    enabled: true,
    source: 'builtin',
  },
]

export const getEnabledQuotes = (quotes: Quote[]) => {
  const enabled = quotes.filter((quote) => quote.enabled)
  return enabled.length > 0 ? enabled : BUILTIN_QUOTES
}
