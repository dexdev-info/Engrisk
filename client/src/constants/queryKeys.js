export const vocabKeys = {
  all: ['vocabulary'],

  details: () => [...vocabKeys.all, 'detail'],
  detailById: (id) => [...vocabKeys.details(), { id }],
  detailBySlug: (slug) => [...vocabKeys.details(), { slug }],

  lists: () => [...vocabKeys.all, 'list'],
  list: (params) => [...vocabKeys.lists(), params],

  my: () => [...vocabKeys.all, 'my'],
  myList: (params) => [...vocabKeys.my(), params],

  reviewQueue: () => [...vocabKeys.all, 'review-queue']
}
