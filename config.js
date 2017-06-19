exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === "production" ?
                        "mongodb://kkindorf88:Zooniebin976@ds133192.mlab.com:33192/img-search" :
                        "mongodb://localhost/img-search");

exports.PORT = process.env.PORT || 8080;
