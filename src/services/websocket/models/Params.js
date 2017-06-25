class Params {
  constructor(token, type, id) {
    this.type = type;
    this.token = token;
    this.id = id;
  }

  static ParseParams(params) {
    let arr = params.split('/');
    if (arr)
      return new Params(arr[1], arr[2], arr[3]);

    return new Params(null, null, null);
  }
}

module.exports = Params;