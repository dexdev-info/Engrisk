import { Schema, model } from 'mongoose'
import slugify from 'slugify'

const vocabularySchema = new Schema(
  {
    word: {
      type: String,
      required: [true, 'Word is required'],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: [100, 'Word cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    // Phonetic pronunciation (IPA)
    pronunciation: {
      type: String,
      default: null,
      trim: true
    },
    // Vietnamese meaning
    meaning: {
      type: String,
      required: [true, 'Meaning is required'],
      maxlength: [500, 'Meaning cannot exceed 500 characters']
    },
    // Example sentence in English
    example: {
      type: String,
      default: null,
      maxlength: [500, 'Example cannot exceed 500 characters']
    },
    // Example translation in Vietnamese
    exampleTranslation: {
      type: String,
      default: null,
      maxlength: [500, 'Example translation cannot exceed 500 characters']
    },
    partOfSpeech: {
      type: String,
      enum: {
        values: [
          'noun',
          'verb',
          'adjective',
          'adverb',
          'pronoun',
          'preposition',
          'conjunction',
          'interjection',
          'other'
        ],
        message: 'Invalid part of speech'
      },
      default: 'other'
    },
    level: {
      type: String,
      enum: {
        values: ['beginner', 'intermediate', 'advanced'],
        message: 'Level must be beginner, intermediate, or advanced'
      },
      default: 'beginner'
    },
    // Image URL for visual learning
    imageUrl: {
      type: String,
      default: null
    },
    // Audio URL for pronunciation
    audioUrl: {
      type: String,
      default: null
    },
    // Synonyms
    synonyms: [
      {
        type: String,
        trim: true
      }
    ],
    // Antonyms
    antonyms: [
      {
        type: String,
        trim: true
      }
    ],
    // Related words
    relatedWords: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Vocabulary'
      }
    ],
    // Usage count (how many users saved this word)
    usageCount: {
      type: Number,
      default: 0
    },
    // ===== Soft Delete =====
    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

/* =======================
    QUERY FILTER
======================= */
// const autoExcludeDeleted = function () {
//   this.where({ isDeleted: false })
// }

// vocabularySchema.pre(/^find/, autoExcludeDeleted)
// vocabularySchema.pre('countDocuments', autoExcludeDeleted)

/* =======================
    SLUG UNIQUE
======================= */
vocabularySchema.pre('validate', async function () {
  if (!this.isModified('word')) return

  const baseSlug = slugify(this.word, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  })

  let slug = baseSlug
  let counter = 1

  while (await this.constructor.exists({ slug, _id: { $ne: this._id } })) {
    slug = `${baseSlug}-${counter++}`
  }

  this.slug = slug
})

/* =======================
    SOFT DELETE (CASCADE)
======================= */
vocabularySchema.methods.softDelete = async function () {
  this.isDeleted = true
  this.deletedAt = new Date()
  await this.save()
}

// Related Words
vocabularySchema.path('relatedWords').validate(function (value) {
  return !value.includes(this._id)
}, 'Related words cannot include itself')

// Usage Count
vocabularySchema.statics.incrementUsage = function (id) {
  return this.updateOne({ _id: id }, { $inc: { usageCount: 1 } })
}
// * use: await Vocabulary.incrementUsage(vocabId)

// Indexes
vocabularySchema.index({ word: 1 })
// *
vocabularySchema.index({
  word: 'text',
  meaning: 'text',
  example: 'text'
})
vocabularySchema.index({ level: 1 })
vocabularySchema.index({ partOfSpeech: 1 })
vocabularySchema.index({ usageCount: -1 })

const Vocabulary = model('Vocabulary', vocabularySchema)
export default Vocabulary
