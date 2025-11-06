// Simple test to verify Jest configuration works
describe('Mobile App', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test basic React Native concepts', () => {
    const mockComponent = { type: 'View', props: { children: [] } };
    expect(mockComponent.type).toBe('View');
  });
});
