const formattArticleData = (articleData, refdata1, refdata2) => {
  return articleData.map(article => {
    const username = article.created_by;
    const slug = article.topic;
    const created_by = refdata1[username];
    const belongs_to = refdata2[slug];
    return { ...article, created_by, belongs_to };
  });
};

const createRef = (data, docs, key, newKey) => {
  return data.reduce((lookupObj, datum, i) => {
    lookupObj[datum[key]] = docs[i][newKey];
    return lookupObj;
  }, {});
};

const formattedComments = (users, articles, commentsData) => commentsData.map(comment => {
  return {
    ...comment, belongs_to: articles.find(article => article.title === comment.belongs_to)._id
    , created_by: users.find(user => comment.created_by === user.username)._id
  };
});

module.exports = { createRef, formattArticleData, formattedComments };