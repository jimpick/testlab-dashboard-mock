import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'

const baseUrl = 'https://mockup-3knoa5s4ea-uc.a.run.app/mockup'

const metricsUrl = baseUrl + '/metrics.json?_shape=array'
const commitsUrl = baseUrl + '/commits.json?_shape=array'

const query = 'select distinct commits.*, results.metricId,' + 
  'metrics.description, results.value, metrics.unit ' +
  'from commits, results, metrics ' +
  'where commits.sha = results.sha and ' +
  'results.metricId = metrics.id and ' +
  'results.sha = commits.sha'

const url = baseUrl + '.json?sql=' +
  encodeURIComponent(query) + '&_shape=array'

class Dashboard extends Component {
  componentDidMount () {
    fetch(url)
      .then(resp => resp.json())
      .then(data => this.setState({ data }))
    fetch(metricsUrl)
      .then(resp => resp.json())
      .then(metrics => this.setState({ metrics }))
    fetch(commitsUrl)
      .then(resp => resp.json())
      .then(commits => this.setState({ commits }))
  }

  render (props, { data, metrics, commits }) {
    if (metrics && commits) {
      const commitHeaders = commits.map(commit => {
        const [date, time] = commit.date.replace(' +0000 UTC', '').split(' ')
        return html`
          <th>
            <div>
              <div class="sha">
                <a href="${commit.url}">${commit.sha.substring(0, 6)}</a>
              </div>
              <div class="date">
                ${date}
              </div>
              <div class="time">
                ${time}
              </div>
              <div class="login">
                ${commit.login}
              </div>
              <div class="message">
                ${commit.message}
              </div>
            </div>
          </th>
        `
      })
      const rows = metrics.map(metric => {
        const dataCols = commits.map(commit => {
          return html`<td>.</td>`
        })
        return html`
          <tr><td>${metric.id}</td>${dataCols}</tr>
        `
      })
      return html`
        <div>
          <div class="tracking-issue">
            <a href="https://github.com/ipfs/canary-testing/issues/1"
              target="_blank">GitHub</a>
          </div>
          <h3>go-ipfs : master</h3>
          <table>
            <tr><th></th>${commitHeaders}</tr>
            ${rows}
          </table>
        </div>
      `
    }
    return html`
      <div>
        Dashboard
        <pre>${commits && JSON.stringify(commits, null, 2)}</pre>
      </div>
    `
  }
}

render(html`<${Dashboard} />`, document.getElementById('dashboard'))

