module.exports = (err, ret) => {
  return {
    get: jest.fn((criteria, callback) => { callback(err, ret); }),
    search: jest.fn((criteria, callback) => { callback(err, { hits: { hits: ret } }); }),
    index: jest.fn((criteria, callback) => { callback(err, ret); }),
    update: jest.fn((document, callback) => { callback(err, ret) }),
    delete: jest.fn((criteria, callback) => { callback(err, ret) })
  }
};