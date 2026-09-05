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
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          // Map backend `id` to `propertyId` for frontend compatibility
          const mapped = data.map(p => ({...p, propertyId: p.id}));
          setProperties(mapped);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      }
    };
    fetchProperties();
  }, []);
  
  const [listings, setListings] = useState(() => {
    const saved = localStorage.getItem('kito_listings');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        }
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      }
    };
    fetchLeads();
  }, []);

  const [surveys, setSurveys] = useState([]);
  useEffect(() => {
    fetch('/api/surveys').then(r => r.ok && r.json().then(setSurveys)).catch(console.error);
  }, []);

  const [offers, setOffers] = useState([]);
  useEffect(() => {
    fetch('/api/offers').then(r => r.ok && r.json().then(setOffers)).catch(console.error);
  }, []);

  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    fetch('/api/expenses').then(r => r.ok && r.json().then(setExpenses)).catch(console.error);
  }, []);

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

  const [articles, setArticles] = useState([]);
  useEffect(() => {
    fetch('/api/articles').then(r => r.ok && r.json().then(setArticles)).catch(console.error);
  }, []);

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

  // localStorage logic for properties removed (now using backend)

  useEffect(() => {
    localStorage.setItem('kito_listings', JSON.stringify(listings));
  }, [listings]);

  // localStorage logic for leads removed (now using backend)

  // localStorage logic for surveys, offers, expenses, articles removed
  useEffect(() => {
    localStorage.setItem('kito_goals', JSON.stringify(goals));
  }, [goals]);

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
  const addArticle = async (data) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const newArticle = await response.json();
        setArticles(prev => [newArticle, ...prev]);
        return newArticle.id;
      }
    } catch (e) { console.error('Error adding article', e); }
  };

  const updateArticle = async (id, data) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const updated = await response.json();
        setArticles(prev => prev.map(a => (a.articleId === id || a.id === id) ? updated : a));
      }
    } catch (e) { console.error('Error updating article', e); }
  };

  const deleteArticle = async (id) => {
    try {
      const response = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setArticles(prev => prev.filter(a => a.articleId !== id && a.id !== id));
      }
    } catch (e) { console.error('Error deleting article', e); }
  };

  // --- PROPERTIES ---
  const addProperty = async (data) => {
    try {
      const payload = {
        title: data.title || 'Tanpa Judul',
        description: data.description || '',
        price: Number(data.price) || 0,
        location: data.location || '',
        status: data.status || 'available'
      };
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const newProperty = await response.json();
        const mapped = { ...newProperty, propertyId: newProperty.id };
        setProperties(prev => [mapped, ...prev]);
        return mapped.propertyId;
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const addBulkProperties = async (dataArray) => {
    console.warn("Bulk insert properties not yet implemented with backend");
    return 0;
  };

  const updateProperty = async (id, data) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const updated = await response.json();
        const mapped = { ...updated, propertyId: updated.id };
        setProperties(prev => prev.map(p => p.propertyId === id ? mapped : p));
      }
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const deleteProperty = async (id) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setProperties(prev => prev.filter(p => p.propertyId !== id));
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
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
  const addLead = async (data) => {
    try {
      const payload = {
        name: data.name || 'Unknown',
        phone: data.phone || '',
        email: data.email || '',
        message: data.message || '',
        propertyId: data.propertyId || '',
        status: data.status || 'New',
        createdBy: user?.name || 'Unknown'
      };
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const newLead = await response.json();
        setLeads(prev => [newLead, ...prev]);
        return newLead.id;
      }
    } catch (error) {
      console.error('Error adding lead:', error);
    }
  };

  const updateLead = async (id, data) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const updated = await response.json();
        setLeads(prev => prev.map(l => l.id === id ? updated : l));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (id) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setLeads(prev => prev.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  // --- SURVEYS ---
  const addSurvey = async (data) => {
    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (response.ok) {
        const newSurvey = await response.json();
        setSurveys(prev => [newSurvey, ...prev]);
        return newSurvey.id;
      }
    } catch (e) { console.error('Error adding survey', e); }
  };

  const updateSurvey = async (id, data) => {
    try {
      const response = await fetch(`/api/surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (response.ok) {
        const updated = await response.json();
        setSurveys(prev => prev.map(s => s.id === id ? updated : s));
      }
    } catch (e) { console.error('Error updating survey', e); }
  };

  const deleteSurvey = async (id) => {
    try {
      const response = await fetch(`/api/surveys/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSurveys(prev => prev.filter(s => s.id !== id));
      }
    } catch (e) { console.error('Error deleting survey', e); }
  };

  // --- OFFERS ---
  const addOffer = async (data) => {
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdBy: user?.name || 'Unknown', data })
      });
      if (response.ok) {
        const newOffer = await response.json();
        setOffers(prev => [newOffer, ...prev]);
        return newOffer.id;
      }
    } catch (e) { console.error('Error adding offer', e); }
  };

  const updateOffer = async (id, data) => {
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (response.ok) {
        const updated = await response.json();
        setOffers(prev => prev.map(o => o.id === id ? updated : o));
      }
    } catch (e) { console.error('Error updating offer', e); }
  };

  const deleteOffer = async (id) => {
    try {
      const response = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setOffers(prev => prev.filter(o => o.id !== id));
      }
    } catch (e) { console.error('Error deleting offer', e); }
  };

  // --- EXPENSES ---
  const addExpense = async (data) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdBy: user?.name || 'Unknown', data })
      });
      if (response.ok) {
        const newExpense = await response.json();
        setExpenses(prev => [newExpense, ...prev]);
        return newExpense.id;
      }
    } catch (e) { console.error('Error adding expense', e); }
  };

  const updateExpense = async (id, data) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      if (response.ok) {
        const updated = await response.json();
        setExpenses(prev => prev.map(e => e.id === id ? updated : e));
      }
    } catch (e) { console.error('Error updating expense', e); }
  };

  const deleteExpense = async (id) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setExpenses(prev => prev.filter(e => e.id !== id));
      }
    } catch (e) { console.error('Error deleting expense', e); }
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
