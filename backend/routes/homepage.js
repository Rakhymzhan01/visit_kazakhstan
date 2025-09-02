const express = require('express');
const router = express.Router();
const HomepageContent = require('../models/HomepageContent');
const { protect, adminOnly } = require('../middleware/auth');

// @desc    Get active homepage content
// @route   GET /api/homepage
// @access  Public
router.get('/', async (req, res) => {
  try {
    let homepageContent = await HomepageContent.findOne({ isActive: true });
    
    // If no content exists, create default content
    if (!homepageContent) {
      homepageContent = new HomepageContent({
        hero: {
          title: 'Your Next Best Trip,',
          subtitle: 'Return Inspired',
          backgroundImage: '/image.png'
        },
        whyVisit: {
          title: 'Why Visit Kazakhstan',
          features: [
            {
              title: 'Silk Road History',
              image: '/desert.jpg',
              bgColor: 'from-blue-400 to-blue-600',
              order: 1
            },
            {
              title: 'Nomadic Soul',
              image: '/shanyrak.jpg',
              bgColor: 'from-amber-600 to-amber-800',
              order: 2
            },
            {
              title: 'Modern Meets Traditional',
              image: '/baiterek.jpg',
              bgColor: 'from-orange-400 to-orange-600',
              order: 3
            },
            {
              title: 'No Crowds, Just Space',
              image: '/kanatnaya_doroga.jpg',
              bgColor: 'from-red-400 to-red-600',
              order: 4
            },
            {
              title: 'Unspoiled Nature',
              image: '/yurta.jpg',
              bgColor: 'from-green-400 to-green-600',
              order: 5
            }
          ]
        },
        tourThemes: {
          tours: [
            {
              title: 'Charyn Canyon & Kolsai Lakes Tour',
              description: 'A classic multi-day trip from Almaty into the Tian Shan mountains — explore canyons, alpine lakes, and mountain villages.',
              image: '/bao_contras.jpg',
              date: '20 may 2025',
              location: 'Almaty',
              rating: 5,
              order: 1
            },
            {
              title: 'Mangystau Desert Expedition',
              description: 'Visit Bozzhyra, Sherkala, and Torysh with local guides. Sleep in a yurt under the stars, explore sacred places.',
              image: '/mangystau.jpg',
              date: '20 may 2025',
              location: '',
              rating: 5,
              order: 2
            },
            {
              title: 'Turkestan - Taraz - Otrar Route',
              description: 'A historical journey across mausoleums, caravanserais, and ruins — with stories of poets, traders, and pilgrims.',
              image: '/kozha_akhmet_yassaui.jpg',
              date: '20 may 2025',
              location: '',
              rating: 5,
              order: 3
            },
            {
              title: 'Almaty',
              description: 'Street art, fashion studios, coffee culture, and live music — explore Almaty\'s youthful soul.',
              image: '/almaty.jpg',
              date: '20 may 2025',
              location: '',
              rating: 5,
              order: 4
            }
          ]
        },
        discoverCities: {
          featuredCity: {
            name: 'Turkestan',
            description: '31° Dry sunshine, 12:30',
            image: '/turkestan.jpg',
            temperature: '31°',
            weather: 'Dry sunshine',
            time: '12:30',
            condition: 'LIGHT OVERCAST'
          }
        },
        instagram: {
          posts: [
            { image: '/nomad_girls.png', alt: 'Nomad girls', order: 1 },
            { image: '/desert.jpg', alt: 'Desert landscape', order: 2 },
            { image: '/yurta.jpg', alt: 'Traditional yurt', order: 3 }
          ]
        },
        events: {
          eventList: [
            { name: 'Kolsay & Kayindy', image: '/bao_contras.jpg', date: '20 may 2025', category: 'Nature', order: 1 },
            { name: 'Charyn Canyon', image: '/charyn.jpg', date: '20 may 2025', category: 'Nature', order: 2 },
            { name: 'Shymbulak', image: '/kanatnaya_doroga.jpg', date: '20 may 2025', category: 'Nature', order: 3 },
            { name: 'Charyn Canyon', image: '/charyn.jpg', date: '20 may 2025', category: 'Nature', order: 4 }
          ]
        },
        about: {
          statistics: [
            { value: '2010', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', order: 1 },
            { value: '50+', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', order: 2 },
            { value: '1000+', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', order: 3 },
            { value: '20', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', order: 4 }
          ]
        }
      });
      
      await homepageContent.save();
    }

    res.json({
      success: true,
      data: homepageContent
    });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update homepage content
// @route   PUT /api/homepage
// @access  Private/Admin
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    let homepageContent = await HomepageContent.findOne({ isActive: true });
    
    if (!homepageContent) {
      homepageContent = new HomepageContent(req.body);
    } else {
      // Update existing content
      Object.assign(homepageContent, req.body);
    }

    await homepageContent.save();

    res.json({
      success: true,
      data: homepageContent
    });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update specific section of homepage
// @route   PUT /api/homepage/:section
// @access  Private/Admin
router.put('/:section', protect, adminOnly, async (req, res) => {
  try {
    const { section } = req.params;
    const validSections = ['hero', 'whyVisit', 'tourThemes', 'discoverCities', 'instagram', 'events', 'forInvestors', 'about'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid section'
      });
    }

    let homepageContent = await HomepageContent.findOne({ isActive: true });
    
    if (!homepageContent) {
      return res.status(404).json({
        success: false,
        error: 'Homepage content not found'
      });
    }

    // Update the specific section
    homepageContent[section] = { ...homepageContent[section], ...req.body };
    await homepageContent.save();

    res.json({
      success: true,
      data: homepageContent
    });
  } catch (error) {
    console.error('Error updating homepage section:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new homepage content version
// @route   POST /api/homepage/version
// @access  Private/Admin
router.post('/version', protect, adminOnly, async (req, res) => {
  try {
    const currentContent = await HomepageContent.findOne({ isActive: true });
    
    if (!currentContent) {
      return res.status(404).json({
        success: false,
        error: 'No active homepage content found'
      });
    }

    // Create new version based on current content
    const newVersion = new HomepageContent({
      ...currentContent.toObject(),
      _id: undefined,
      isActive: false,
      version: currentContent.version + 1,
      createdAt: undefined,
      updatedAt: undefined
    });

    await newVersion.save();

    res.json({
      success: true,
      data: newVersion,
      message: 'New version created'
    });
  } catch (error) {
    console.error('Error creating homepage version:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get all homepage content versions
// @route   GET /api/homepage/versions
// @access  Private/Admin
router.get('/versions', protect, adminOnly, async (req, res) => {
  try {
    const versions = await HomepageContent.find({})
      .select('version isActive createdAt updatedAt')
      .sort({ version: -1 });

    res.json({
      success: true,
      data: versions
    });
  } catch (error) {
    console.error('Error fetching homepage versions:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Activate a specific version
// @route   PUT /api/homepage/versions/:id/activate
// @access  Private/Admin
router.put('/versions/:id/activate', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deactivate all versions
    await HomepageContent.updateMany({}, { isActive: false });
    
    // Activate the specified version
    const activatedVersion = await HomepageContent.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!activatedVersion) {
      return res.status(404).json({
        success: false,
        error: 'Version not found'
      });
    }

    res.json({
      success: true,
      data: activatedVersion,
      message: 'Version activated successfully'
    });
  } catch (error) {
    console.error('Error activating homepage version:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;