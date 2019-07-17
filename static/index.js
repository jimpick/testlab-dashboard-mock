import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'

const url = 'https://mockup-3knoa5s4ea-uc.a.run.app/mockup.json?sql=select+distinct+commits.*%2C+results.metricId%2C+metrics.description%2C+results.value%2C+metrics.unit+from+commits%2C+results%2C+metrics+where+commits.sha+%3D+results.sha+and+results.metricId+%3D+metrics.id+and+results.sha+%3D+commits.sha'

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
  }

  render (props, { data }) {
    return html`
      <div>
        Dashboard
        <pre>${data && JSON.stringify(data, null, 2)}</pre>
      </div>
    `
  }
}

render(html`<${Dashboard} />`, document.getElementById('dashboard'))

