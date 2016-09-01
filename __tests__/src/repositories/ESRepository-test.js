import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  it('Cannot create with an undefined source', () => {
    let undefinedSource;

    expect(() => new ESRepository(undefinedSource)).toThrowError(ESRepository.INVALID_SOURCE);
  });

  it('Cannot create with a source null', () => {
    let nullSource = null;

    expect(() => new ESRepository(nullSource)).toThrowError(ESRepository.INVALID_SOURCE);
  });

  /*
    it('Cannot create with an invalid uri format source', () => {
      var invalidSource = "invalidUriFormat";
  
      expect(() => new ESRepository(invalidSource)).toThrowError(ESRepository.INVALID_SOURCE);
    });
  */

  it('Can create a valid ESRepository', () => {
    let url = 'http://localhost:9200/';
    let repo = new ESRepository(url);

    expect(repo.Source).toEqual(url);
    expect(repo.ESClient && repo.ESClient != null).toEqual(true);
  });
});