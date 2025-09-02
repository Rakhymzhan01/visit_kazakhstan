const mongoose = require('mongoose');

const featureCardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  bgColor: { type: String, default: 'from-blue-400 to-blue-600' },
  order: { type: Number, default: 0 }
});

const tourThemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, default: '' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  order: { type: Number, default: 0 }
});

const citySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  temperature: { type: String, default: '31°' },
  weather: { type: String, default: 'Dry sunshine' },
  time: { type: String, default: '12:30' },
  condition: { type: String, default: 'LIGHT OVERCAST' }
});

const instagramPostSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, default: 'Nature' },
  order: { type: Number, default: 0 }
});

const statisticSchema = new mongoose.Schema({
  value: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const homepageContentSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: { type: String, required: true, default: 'Your Next Best Trip,' },
    subtitle: { type: String, required: true, default: 'Return Inspired' },
    backgroundImage: { type: String, required: true, default: '/image.png' }
  },

  // Why Visit Kazakhstan Section
  whyVisit: {
    title: { type: String, required: true, default: 'Why Visit Kazakhstan' },
    features: [featureCardSchema]
  },

  // Top Tour Themes Section
  tourThemes: {
    title: { type: String, required: true, default: 'Top Tour Themes' },
    description: { 
      type: String, 
      required: true, 
      default: 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.' 
    },
    tours: [tourThemeSchema]
  },

  // Discover Cities Section
  discoverCities: {
    title: { type: String, required: true, default: 'Discover Cities' },
    description: { 
      type: String, 
      required: true, 
      default: 'Kazakhstan\'s cities reflect the country\'s past, present, and future — from ancient Silk Road stops to futuristic capitals, sleepy desert towns to cultural and academic centers. Each has its own character, rhythm, and reason to explore.' 
    },
    mapImage: { type: String, required: true, default: '/kz_map.png' },
    featuredCity: citySchema
  },

  // Instagram Section
  instagram: {
    handle: { type: String, required: true, default: '@into.kazakhstan' },
    title: { type: String, required: true, default: '@into.kazakhstan' },
    description: { 
      type: String, 
      required: true, 
      default: 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.' 
    },
    posts: [instagramPostSchema]
  },

  // Explore Events Section
  events: {
    title: { type: String, required: true, default: 'Explore Events' },
    description: { 
      type: String, 
      required: true, 
      default: 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.' 
    },
    eventList: [eventSchema]
  },

  // For Investors Section
  forInvestors: {
    title: { type: String, required: true, default: 'For Investors' },
    backgroundImage: { type: String, required: true, default: '/expo.jpg' },
    buttonText: { type: String, required: true, default: 'Show all tours' }
  },

  // About Section
  about: {
    logo: { type: String, required: true, default: '/Logo 2.png' },
    title: { type: String, required: true, default: 'About us' },
    description: { 
      type: String, 
      required: true, 
      default: 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.' 
    },
    statistics: [statisticSchema]
  },

  // Meta fields
  isActive: { type: Boolean, default: true },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Ensure only one active homepage content at a time
homepageContentSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

module.exports = mongoose.model('HomepageContent', homepageContentSchema);