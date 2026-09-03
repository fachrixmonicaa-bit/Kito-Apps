import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const PropertyContext = createContext();

import defaultLocations from '../data/locationData.json';

// Utility for mapping bobot to category
export const getZonaPerkembanganCategory = (bobot) => {
  if (bobot >= 80) return 'Puncak';
  if (bobot >= 70) return 'Berkembang Pesat';
  if (bobot >= 60) return 'Berkembang';
  if (bobot >= 50) return 'Netral';
  return 'Tertinggal';
};

// Haversine formula to calculate distance between two coordinates in km
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const toRadian = angle => (Math.PI / 180) * angle;
  const distance = (a, b) => (Math.PI / 180) * (a - b);
  const RADIUS_OF_EARTH_IN_KM = 6371;

  const dLat = distance(lat2, lat1);
  const dLon = distance(lon2, lon1);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));
  return RADIUS_OF_EARTH_IN_KM * c;
};

// Predict Building Price per m2 based on criteria and settings
export const predictBuildingPrice = (jenis, kondisi, tingkat, settings) => {
  if (!settings) return 0; // Fallback if settings not passed
  
  // Base price for Jenis
  let basePrice = settings.basePrices[jenis] || 3500000;
  
  if (jenis === 'Tanah') return 0; // Tanah kosong tidak ada harga bangunan

  // Apply Tingkat multiplier
  const tingkatCategory = settings.tingkatMultipliers[jenis];
  if (tingkatCategory) {
     const multiplier = tingkatCategory[tingkat] || 1.0;
     basePrice *= multiplier;
  }

  // Apply Kondisi multiplier
  const kondisiMultiplier = settings.kondisiMultipliers[kondisi] || 1.0;
  basePrice *= kondisiMultiplier;

  return Math.round(basePrice);
};

export const PropertyProvider = ({ children }) => {
  const { user } = useAuth();

  // State for location master data
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('kito_locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });

  // State for all KitoApps databases
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('kito_properties');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('kito_listings');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('kito_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [surveys, setSurveys] = useState(() => {
    const saved = localStorage.getItem('kito_surveys');
    return saved ? JSON.parse(saved) : [];
  });

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('kito_offers');
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('kito_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('kito_goals');
    return saved ? JSON.parse(saved) : { 
      companyTargetValue: 10000000000, 
      companyTargetListing: 50,
      companyTargetLead: 100,
      agentTargetValue: 1000000000,
      agentTargetListing: 5,
      agentTargetLead: 10
    };
  });

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('kito_articles');
    return saved ? JSON.parse(saved) : [
      {
        articleId: 'NEWS-1001',
        title: 'Suku Bunga KPR Turun, Ini Momen Emas Beli Properti di Padang',
        excerpt: 'Bank Indonesia (BI) kembali menahan suku bunga acuan, namun beberapa bank BUMN mulai memberikan promo KPR menarik. Apakah ini saat yang tepat?',
        content: 'Bank Indonesia (BI) kembali menahan suku bunga acuan, namun beberapa bank BUMN mulai memberikan promo KPR menarik. Apakah ini saat yang tepat untuk berinvestasi properti di Padang? Mengingat potensi pertumbuhan wilayah, sekarang adalah momen yang tepat.',
        category: 'Market',
        status: 'Published',
        tanggalInput: new Date('2026-08-24T10:00:00Z').toISOString(),
        author: 'Admin Kito',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'
      },
      {
        articleId: 'NEWS-1002',
        title: 'Prospek Investasi Properti Komersial di Padang Semakin Menjanjikan',
        excerpt: 'Infrastruktur yang berkembang pesat menjadikan area komersial incaran utama para investor tahun ini.',
        content: 'Infrastruktur yang berkembang pesat menjadikan area komersial incaran utama. Dengan proyek jalan tol baru dan pengembangan pelabuhan, nilai komersial diprediksi naik pesat dalam 5 tahun ke depan.',
        category: 'Investasi',
        status: 'Published',
        tanggalInput: new Date('2026-08-24T14:30:00Z').toISOString(),
        author: 'Admin Kito',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
      }
    ];
  });

  const [correctionFactors, setCorrectionFactors] = useState(() => {
    const saved = localStorage.getItem('kito_correction_factors');
    return saved ? JSON.parse(saved) : {
      akses: 10.0,
      posisi: 5.0,
      legalitas: 10.0,
      kawasan: 8.0,
      perkembangan: 2.5,
      mitigasi: 0.35,
      utilitas: 0.20
    };
  });

  const updateCorrectionFactors = (newFactors) => {
    setCorrectionFactors(prev => ({ ...prev, ...newFactors }));
  };

  const [valuationSettings, setValuationSettings] = useState(() => {
    const saved = localStorage.getItem('kito_valuation_settings');
    return saved ? JSON.parse(saved) : {
      basePrices: {
        'Rumah': 3500000,
        'Ruko': 4000000,
        'Gudang': 3000000,
        'Tanah': 0
      },
      tingkatMultipliers: {
        'Rumah': { '1 Lantai': 1.0, '1,5 Lantai': 1.15, '2 Lantai': 1.28, '2,5 Lantai': 1.4, '3 Lantai': 1.57, '3,5 Lantai': 1.65, '4 Lantai': 1.71, '4,5 Lantai': 1.78, '5 Lantai': 1.85, '> 5 Lantai': 2.0 },
        'Ruko': { '1 Lantai': 1.0, '1,5 Lantai': 1.05, '2 Lantai': 1.12, '2,5 Lantai': 1.18, '3 Lantai': 1.25, '3,5 Lantai': 1.3, '4 Lantai': 1.35, '4,5 Lantai': 1.4, '5 Lantai': 1.45, '> 5 Lantai': 1.5 }
      },
      kondisiMultipliers: {
        'Baru': 1.1,
        'Standar': 1.0,
        'Perlu Renovasi': 0.7,
        'Mewah': 1.4
      },
      tanahDiscounts: {
        'Kavling Siap Bangun': 0,
        'Perbukitan': 15,
        'TimbunPerMeter': 5 
      }
    };
  });

  const updateValuationSettings = (newSettings) => {
    setValuationSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('kito_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('kito_correction_factors', JSON.stringify(correctionFactors));
  }, [correctionFactors]);

  useEffect(() => {
    localStorage.setItem('kito_valuation_settings', JSON.stringify(valuationSettings));
  }, [valuationSettings]);

  useEffect(() => {
    localStorage.setItem('kito_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('kito_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('kito_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('kito_surveys', JSON.stringify(surveys));
  }, [surveys]);

  useEffect(() => {
    localStorage.setItem('kito_offers', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('kito_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('kito_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('kito_articles', JSON.stringify(articles));
  }, [articles]);

  // Generators for IDs
  const generateId = (prefix) => {
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
  };

  // --- LOCATIONS ---
  const updateLocation = (kecamatan, kelurahan, updatedData) => {
    setLocations(prev => prev.map(loc => 
      loc.kecamatan === kecamatan && loc.kelurahan === kelurahan
        ? { ...loc, ...updatedData }
        : loc
    ));
  };

  // --- ARTICLES (KitoNews) ---
  const addArticle = (data) => {
    const newArticle = {
      articleId: generateId('NEWS'),
      tanggalInput: new Date().toISOString(),
      ...data
    };
    setArticles(prev => [newArticle, ...prev]);
    return newArticle.articleId;
  };

  const updateArticle = (id, data) => {
    setArticles(prev => prev.map(a => a.articleId === id ? { ...a, ...data } : a));
  };

  const deleteArticle = (id) => {
    setArticles(prev => prev.filter(a => a.articleId !== id));
  };

  // --- PROPERTIES ---
  const addProperty = (data) => {
    const newProperty = {
      propertyId: generateId('PROP'),
      tanggalInput: new Date().toISOString(),
      ...data
    };
    setProperties(prev => [newProperty, ...prev]);
    return newProperty.propertyId;
  };

  const addBulkProperties = (dataArray) => {
    const newProperties = dataArray.map(data => ({
      propertyId: generateId('PROP'),
      tanggalInput: new Date().toISOString(),
      ...data
    }));
    setProperties(prev => [...newProperties, ...prev]);
    return newProperties.length;
  };

  const updateProperty = (id, data) => {
    setProperties(prev => prev.map(p => p.propertyId === id ? { ...p, ...data } : p));
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(p => p.propertyId !== id));
  };

  // --- LISTINGS ---
  const addListing = (data) => {
    const newListing = {
      listingId: generateId('LST'),
      tanggalInput: new Date().toISOString(),
      ...data
    };
    setListings(prev => [newListing, ...prev]);
    return newListing.listingId;
  };

  const updateListing = (id, data) => {
    setListings(prev => prev.map(l => l.listingId === id ? { ...l, ...data } : l));
  };

  const deleteListing = (id) => {
    setListings(prev => prev.filter(l => l.listingId !== id));
  };

  // --- LEADS ---
  const addLead = (data) => {
    const newLead = {
      id: generateId('LD'),
      date: new Date().toISOString(),
      status: 'New',
      createdBy: user?.name || 'Unknown',
      ...data
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead.id;
  };

  const updateLead = (id, data) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  // --- SURVEYS ---
  const addSurvey = (data) => {
    const newSurvey = {
      id: generateId('SRV'),
      date: new Date().toISOString(),
      status: 'Scheduled',
      ...data
    };
    setSurveys(prev => [newSurvey, ...prev]);
    return newSurvey.id;
  };

  const updateSurvey = (id, data) => {
    setSurveys(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteSurvey = (id) => {
    setSurveys(prev => prev.filter(s => s.id !== id));
  };

  // --- OFFERS ---
  const addOffer = (data) => {
    const newOffer = {
      id: generateId('OFR'),
      date: new Date().toISOString(),
      status: 'Draft',
      financeStatus: 'Pending',
      createdBy: user?.name || 'Unknown',
      ...data
    };
    setOffers(prev => [newOffer, ...prev]);
    return newOffer.id;
  };

  const updateOffer = (id, data) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...data } : o));
  };

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  // --- EXPENSES ---
  const addExpense = (data) => {
    const newExpense = {
      id: generateId('EXP'),
      date: new Date().toISOString(),
      createdBy: user?.name || 'Unknown',
      ...data
    };
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense.id;
  };

  const updateExpense = (id, data) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <PropertyContext.Provider value={{
      locations, updateLocation,
      correctionFactors, updateCorrectionFactors,
      valuationSettings, updateValuationSettings,
      articles, addArticle, updateArticle, deleteArticle,
      properties, addProperty, addBulkProperties, updateProperty, deleteProperty,
      listings, addListing, updateListing, deleteListing,
      leads, addLead, updateLead, deleteLead,
      surveys, addSurvey, updateSurvey, deleteSurvey,
      offers, addOffer, updateOffer, deleteOffer,
      expenses, addExpense, updateExpense, deleteExpense,
      goals, setGoals
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => React.useContext(PropertyContext);
export const useProperties = useProperty;
