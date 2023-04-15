// INPUT: a queryobj and a querystring
// OUTPUT: after each operation it's return itself which can be used to execute the query

// This interface can be used liked that:
/*    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
*/

class APIFeatures {
  // query: Model.find will return a query object which is taken here as query
  // string:  string is the querystring from the request
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // search depend on title
  search() {
    const keyword = this.queryString.keyword
      ? {
          title: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // Query should be look like this: duration[gte]=3&endDate[gte]=11/12/2023&&startDate[lte]=10/12/2023
  filter() {
    const queryObj = { ...this.queryString };
    // Excluding those fields in order to continue current stage
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Query should be like this: sort=createdAt,ratings - will sort items based on the createdAt and ratings fields
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Query should be look like this: fields=name,photo - those field will be selected
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // For pagination page: indicate which page we want, limit indicate how many items should be in the page
  // Example: page=5&limit=10
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
