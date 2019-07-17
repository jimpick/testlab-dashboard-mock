import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'

const baseUrl = 'https://mockup-3knoa5s4ea-uc.a.run.app/mockup'

const metricsUrl = baseUrl + '/metrics.json?_shape=array'

const query = 'select distinct commits.*, results.metricId,' + 
  'metrics.description, results.value, metrics.unit ' +
  'from commits, results, metrics ' +
  'where commits.sha = results.sha and ' +
  'results.metricId = metrics.id and ' +
  'results.sha = commits.sha'

const url = baseUrl + '.json?sql=' +
  encodeURIComponent(query) + '&_shape=array'

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount () {
    fetch(url)
      .then(resp => resp.json())
      .then(data => this.setState({ data }))
    fetch(metricsUrl)
      .then(resp => resp.json())
      .then(metrics => this.setState({ metrics }))
  }

  render (props, { data, metrics }) {
    if (metrics) {
      const rows = metrics.map(metric => {
        return html`
          <tr><td>${metric.id}</td></tr>
        `
      })
      return html`<table>${rows}</table>`
    }
    return html`
      <div>
        Dashboard
        <pre>${metrics && JSON.stringify(metrics, null, 2)}</pre>
      </div>
    `
  }
}

render(html`<${Dashboard} />`, document.getElementById('dashboard'))

