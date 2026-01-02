import { Schema, model } from 'mongoose'

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
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Level must be beginner, intermediate, or advanced'
      },
      default: 'Beginner'
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
    }
  },
  {
    timestamps: true
  }
)

// Indexes
vocabularySchema.index({ word: 1 })
vocabularySchema.index({ level: 1 })
vocabularySchema.index({ partOfSpeech: 1 })
vocabularySchema.index({ usageCount: -1 })

const Vocabulary = model('Vocabulary', vocabularySchema)
export default Vocabulary
