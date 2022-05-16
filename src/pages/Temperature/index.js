import { BasePage } from "../BasePage";

/**
 * Temperature page component
 */
export class TemperaturePage extends BasePage {
  constructor(root) {
    super(root, { title: "Temperature", topic: "temperature" });
  }
}
