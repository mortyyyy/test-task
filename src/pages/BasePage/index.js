import { Component } from "../../components/Component";
import { YearRangePicker } from "../../components/YearRangePicker";
import { AppStorageService } from "../../storage";
import { Chart } from "../../components/Chart";
import { MockService } from "../../api";

//TODO compute values
const MIN_YEAR = 1881;
const MAX_YEAR = 2006;

const DEFAULT_FROM_VALUE = new Date(MIN_YEAR, 0, 1);
const DEFAULT_TO_VALUE = new Date(MAX_YEAR, 11, 31);

function tooltip({ t, v }) {
  return `
    <div class="base-page-chart_tooltip">
       <span class="date">${new Date(t).toLocaleDateString("ru-RU")}</span>
       <span>${v}</span>
    </div>
  `;
}

/**
 * Base page layout
 */
export class BasePage extends Component {
  constructor(root, { title, topic }) {
    super(root, { className: "base-page" });
    this.title = title;
    this.topic = topic;

    this.dateFrom = DEFAULT_FROM_VALUE;
    this.dateTo = DEFAULT_TO_VALUE;
  }
  toHTML() {
    return `
            <div class="base-page_header">
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
                        <span class="widget-mock_value">77</span>
                    </div>
                </div>
                 <div class="widget widget-mock">
                    <div class="widget-mock_logo widget-mock_logo__red"></div>
                    <div class="widget-mock_content">
                        <span class="widget-mock_title">Title</span>
                        <span class="widget-mock_value">12</span>
                    </div>
                </div>
            </div>   
            <div class="widget" id="chart"></div>
          `.trim();
  }

  handlePickerValueChange(yearFrom, yearTo) {
    this.dateFrom = new Date(yearFrom, 0, 1);
    this.dateTo = new Date(yearTo, 11, 31);
    this.render();
  }

  async fetchData(dateFrom, dateTo) {
    const storage = AppStorageService.getInstance();
    const savedRecords = await storage.getRecords(this.topic, dateFrom, dateTo);
    if (!savedRecords.length) {
      const newRecords = await MockService.fetchData(this.topic);
      setTimeout(() => storage.addRecords(this.topic, newRecords), 0);
      return newRecords;
    } else {
      return savedRecords;
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
    this.children.chart.update(data, false);
  }
}
