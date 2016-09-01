import ESRepository from '../../../src/repositories/ESRepository';

describe('ESRepository', () => {
  it('Cannot create with an undefined ESClient', () => {
    let undefinedESClient;

    expect(() => new ESRepository(undefinedESClient)).toThrowError(ESRepository.INVALID_CLIENT);
  });

  it('Cannot create with a null ESClient', () => {
    let nullESClient = null;

    expect(() => new ESRepository(nullESClient)).toThrowError(ESRepository.INVALID_CLIENT);
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