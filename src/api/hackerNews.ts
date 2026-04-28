import axios from 'axios';

export interface HNRawItem {
  id: number;
  type?: string;
  title?: string;
  url?: string;
  by?: string;
  score?: number;
  time?: number;
}

export interface HNStory {
  id: number;
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
  type: 'story';
}


const BASE_URL = 'https://hacker-news.firebaseio.com/v0';
const TOP_STORIES_LIMIT = 20;

export const hnApi = axios.create({
  baseURL: BASE_URL,
});

hnApi.interceptors.request.use(
  (config) => {
    console.log('HN Request:', config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

hnApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HN Error:', error?.response?.status);

    if (!error.response) {
      console.log('No Internet Connection');
    }

    return Promise.reject(error);
  }
);


function isValidStory(
  item: HNRawItem | null
): item is HNRawItem & {
  title: string;
  url: string;
  by: string;
  score: number;
  time: number;
} {
  return (
    item !== null &&
    item.type === 'story' &&
    typeof item.title === 'string' &&
    typeof item.url === 'string' &&
    item.url.length > 0 &&
    typeof item.by === 'string' &&
    typeof item.score === 'number' &&
    typeof item.time === 'number'
  );
}


export async function fetchTopStoryIds(): Promise<number[]> {
  const response = await hnApi.get<number[]>('/topstories.json');
  return response.data.slice(0, TOP_STORIES_LIMIT);
}

export async function fetchItem(id: number): Promise<HNRawItem | null> {
  try {
    const response = await hnApi.get<HNRawItem>(`/item/${id}.json`);
    return response.data;
  } catch {
    return null;
  }
}

export async function fetchTopStories(): Promise<HNStory[]> {
  const ids = await fetchTopStoryIds();

  const items = await Promise.all(ids.map((id) => fetchItem(id)));

  const stories: HNStory[] = items
    .filter(isValidStory)
    .map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      by: item.by,
      score: item.score,
      time: item.time,
      type: 'story',
    }));

  return stories;
}