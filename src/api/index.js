const getURL = (topic) => `../../static/mock/${topic}.json`;

export class MockService {
  static async fetchData(topic) {
    return await fetch(getURL(topic));
  }
}
