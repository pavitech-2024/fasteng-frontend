import { buildMissingEssaySummary } from '@/components/asphalt/dosages/marshall/tables/step-2-table';

describe('Marshall step 2 validation', () => {
  it('should summarize missing essays for aggregate materials in a single message', () => {
    const rows = [
      { _id: '1', name: 'Agregado 1', type: 'coarseAggregate', hasRequiredEssay: false },
      { _id: '2', name: 'Ligante 1', type: 'asphaltBinder', hasRequiredEssay: false },
    ];

    const summary = buildMissingEssaySummary(rows);

    expect(summary).toContain('Agregado 1');
    expect(summary).toContain('granulometria');
    expect(summary).toContain('massa específica');
    expect(summary).toContain('Ligante 1');
    expect(summary).toContain('viscosidade');
  });
});
