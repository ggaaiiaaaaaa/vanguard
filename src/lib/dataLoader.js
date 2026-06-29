import { wixClient } from './wix.js';
import { mockHomepageContent, mockValues, mockTransformations } from './mockData.js';

// Helper to determine if we should attempt to connect to Wix
const isWixConfigured = () => {
  const clientId = import.meta.env.PUBLIC_WIX_CLIENT_ID;
  return clientId && clientId !== 'your-wix-client-id-here' && clientId !== 'dummy-client-id';
};

/**
 * Fetches homepage metadata and content.
 */
export async function getHomepageContent() {
  if (!isWixConfigured()) {
    return mockHomepageContent;
  }

  try {
    const response = await wixClient.items.queryDataItems({
      dataCollectionId: 'vtp_content'
    }).limit(1).find();

    if (response.items && response.items.length > 0) {
      // Map the Wix fields to our clean app fields
      const wixItem = response.items[0].data;
      return {
        heroTitle: wixItem.heroTitle || mockHomepageContent.heroTitle,
        heroSubtitle: wixItem.heroSubtitle || mockHomepageContent.heroSubtitle,
        purposeTitle: wixItem.purposeTitle || mockHomepageContent.purposeTitle,
        purposeText: wixItem.purposeText || mockHomepageContent.purposeText,
        missionTitle: wixItem.missionTitle || mockHomepageContent.missionTitle,
        missionBody: wixItem.missionBody || mockHomepageContent.missionBody,
        missionVerse: wixItem.missionVerse || mockHomepageContent.missionVerse,
        missionReference: wixItem.missionReference || mockHomepageContent.missionReference,
        contactEmail: wixItem.contactEmail || mockHomepageContent.contactEmail
      };
    }
  } catch (error) {
    console.warn('Wix API connection failed. Falling back to local content.', error);
  }

  return mockHomepageContent;
}

/**
 * Fetches Vanguard's core values.
 */
export async function getValues() {
  if (!isWixConfigured()) {
    return mockValues;
  }

  try {
    const response = await wixClient.items.queryDataItems({
      dataCollectionId: 'vtp_values'
    }).find();

    if (response.items && response.items.length > 0) {
      return response.items.map(item => ({
        id: item._id,
        title: item.data.title,
        description: item.data.description,
        icon: item.data.icon || 'Award'
      }));
    }
  } catch (error) {
    console.warn('Wix API value fetch failed. Falling back to local values.', error);
  }

  return mockValues;
}

/**
 * Fetches Vanguard's transformations (case studies).
 */
export async function getTransformations() {
  if (!isWixConfigured()) {
    return mockTransformations;
  }

  try {
    const response = await wixClient.items.queryDataItems({
      dataCollectionId: 'vtp_transformations'
    }).find();

    if (response.items && response.items.length > 0) {
      return response.items.map(item => ({
        id: item._id,
        title: item.data.title,
        client: item.data.client,
        category: item.data.category,
        summary: item.data.summary,
        year: item.data.year,
        tags: item.data.tags ? item.data.tags.split(',').map(t => t.trim()) : [],
        image: item.data.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      }));
    }
  } catch (error) {
    console.warn('Wix API transformations fetch failed. Falling back to local mock data.', error);
  }

  return mockTransformations;
}
