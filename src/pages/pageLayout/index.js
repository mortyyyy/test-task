import { Component } from "../../components/component";
import { YearRangePicker } from "../../components/YearRangePicker";
import { AppStorageService } from "../../storage";
import { Chart } from "../../components/chart";

//TODO compute values
const MIN_YEAR = 1800;
const MAX_YEAR = 2006;

const DEFAULT_FROM_VALUE = new Date(MIN_YEAR, 0, 1);
const DEFAULT_TO_VALUE = new Date(MAX_YEAR, 11, 31);

function tooltip({ t, v }) {
  return `
    <span class="date">${t.toLocaleDateString("ru-RU")}</span>
    <span>${v}</span>
  `;
}

/**
 * Base page layout
 */
export class Page extends Component {
  constructor(root, { title, topic }) {
    super(root, {});
    this.title = title;
    this.topic = topic;

    this.dateFrom = DEFAULT_FROM_VALUE;
    this.dateTo = DEFAULT_TO_VALUE;
  }
  toHTML() {
    return `
            <div class="page-header">
               <h1>${this.title}</h1>  
               <div id="filter-container"></div>
            </div>
            <div class="mock-widgets">
                <div class="widget widget-mock">
                    <div class="widget-mock_logo widget-mock_logo__blue"></div>
                    <div class="widget-mock_content">
                        <span class="widget-mock_title">Title</span>
                        <span class="widget-mock_value">49</span>
                    </div>
                </div>
                 <div class="widget widget-mock">
                    <div class="widget-mock_logo widget-mock_logo__green"></div>
                    <div class="widget-mock_content">
                        <span class="widget-mock_title">Title</span>
                        <span class="widget-mock_value">49</span>
                    </div>
                </div>
                 <div class="widget widget-mock">
                    <div class="widget-mock_logo widget-mock_logo__red"></div>
                    <div class="widget-mock_content">
                        <span class="widget-mock_title">Title</span>
                        <span class="widget-mock_value">49</span>
                    </div>
                </div>
            </div>   
            <div class="widget" id="chart"></div>
          `.trim();
  }

  handlePickerValueChange(yearFrom, yearTo) {
    this.dateFrom = new Date(yearFrom, 0, 1);
    this.dateTo = new Date(yearTo + 1, 0, 1);
    this.render();
  }

  async fetchData(dateFrom, dateTo) {
    const storage = AppStorageService.getInstance();
    const existingRecords = await storage.getRecords(
      this.topic,
      dateFrom,
      dateTo
    );
    if (!existingRecords.length) {
      const response = await fetch(`./${this.topic}.json`);
      const records = await response.json();
      await storage.addRecords(this.topic, records);
      return records;
    } else {
      return existingRecords;
    }
  }

  registerChildren() {
    return {
      picker: new YearRangePicker(document.getElementById("filter-container"), {
        onChange: (from, to) => this.handlePickerValueChange(from, to),
        start: MIN_YEAR,
        end: MAX_YEAR,
        fromValue: this.dateFrom.getFullYear(),
        toValue: this.dateTo.getFullYear(),
      }),
      chart: new Chart(document.getElementById("chart"), {
        isLoading: true,
        tooltipFormatter: tooltip,
      }),
    };
  }

  async afterRender() {
    this.children.picker.render();
    this.children.chart.render();

    const data = await this.fetchData(this.dateFrom, this.dateTo);
    this.children.chart.update(data.slice(0, 100), false);
  }
}
