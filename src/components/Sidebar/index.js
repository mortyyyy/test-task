import { Component } from "../Component";

export class Sidebar extends Component {
  toHTML() {
    return `
        <div class="app-sidebar_logo"></div>
        <nav>
            <ul>
                <li><a href="/">Temperature</a></li>
                <li><a href="/precipitation">Precipitation</a></li>
            </ul>
        </nav>
        <div class="app-sidebar_profile">
            <span class="app-sidebar_user-picture"></span>
            <span class="app-sidebar_user-name">Anna Perkins</span>
        </div>
       `;
  }
}
