const getURL = (topic) => `../../static/mock/${topic}.json`;

export class MockService {
  static async fetchData(topic) {
    const response = await fetch(getURL(topic));
    return await response.json();
  }
}
