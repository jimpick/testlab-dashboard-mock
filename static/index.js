import { html, Component, render } from 'https://unpkg.com/htm/preact/standalone.mjs'

const baseUrl = 'https://mockup20190718-1-3knoa5s4ea-uc.a.run.app/mockup'
// const baseUrl = 'http://127.0.0.1:8001/mockup'

const testsUrl = baseUrl + '/test.json?_shape=array&_size=max'
const metricsUrl = baseUrl + '/metric.json?_shape=array&_size=max'
const commitsUrl = baseUrl + '/commit.json?_shape=array&_size=max'

const query = sql => baseUrl + '.json?sql=' + encodeURIComponent(sql) +
  '&_shape=array&_size=max'
const testSuitesUrl = query('select slug, name, url from test_suite ' +
  'order by sort_order, slug')
const resultsUrl = query('select result.*, test_run.* from result, test_run ' +
  'where result.test_run_id = test_run.id')

class Dashboard extends Component {
  componentDidMount () {
    fetch(testSuitesUrl)
      .then(resp => resp.json())
      .then(testSuites => this.setState({ testSuites }))
    fetch(testsUrl)
      .then(resp => resp.json())
      .then(tests => this.setState({ tests }))
    fetch(metricsUrl)
      .then(resp => resp.json())
      .then(metrics => this.setState({ metrics }))
    fetch(commitsUrl)
      .then(resp => resp.json())
      .then(commits => this.setState({ commits }))
    fetch(resultsUrl)
      .then(resp => resp.json())
      .then(results => this.setState({ results }))
  }

  render (_, { testSuites, tests, metrics, commits, results }) {
    if (testSuites && tests && metrics && commits && results) {
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
      const rows = []
      for (const testSuite of testSuites) {
        const { slug: testSuiteSlug, name: testSuiteName, url } = testSuite
        rows.push(html`
          <tr class="suite">
            <td colspan=${commits.length + 1}>
              <div><a href=${url}>${testSuiteName}</a></div>
            </td>
          </tr>
        `)
        const filteredTests = tests
          .filter(test => test.test_suite_slug === testSuiteSlug)
          .sort((a, b) => a.sort_order - b.sort_order)
        filteredTests.forEach(test => {
          const dataCols = commits.map(commit => {
            return html`<td></td>`
          })
          rows.push(html`
            <tr
              class="test"
              data-test-slug=${test.slug}
              data-test-description=${test.description}
            >
              <td><a href=${test.url}>${test.name}</a></td>
              ${dataCols}
            </tr>
          `)

          const filteredMetrics = metrics
            .filter(metric => metric.test_suite_slug === testSuiteSlug &&
              metric.test_slug === test.slug)
            .sort((a, b) => a.sort_order - b.sort_order)
          filteredMetrics.forEach(metric => {
            const dataCols = commits.map(commit => {
              // FIXME: This is inefficient
              const result = results.filter(result =>
                result.sha === commit.sha &&
                result.test_suite_slug === testSuiteSlug &&
                result.test_slug === test.slug &&
                result.metric_slug === metric.slug
              )
              if (result.length === 1) {
                if (metric.unit === 'seconds') {
                  return html`<td>${result[0].value}s</td>`
                }
                if (metric.unit === 'link') {
                  return html`<td><a href=${result[0].value}>Link</a></td>`
                }
                return html`<td>${result[0].value}</td>`
              }
              return html`<td></td>`
            })
            rows.push(html`
              <tr
                class="metric"
                data-test-slug=${test.slug}
                data-test-description=${test.description}
              >
                <td>${metric.slug}</td>
                ${dataCols}
              </tr>
            `)
          })

        })
      }
      /*
      const rows = metrics.map(metric => {
        const dataCols = commits.map(commit => {
          return html`<td>.</td>`
        })
        return html`
          <tr><td>${metric.slug}</td>${dataCols}</tr>
        `
      })
      */
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
    return html`<div>Loading...</div>`
    /*
    return html`
      <div>
        Dashboard
        <pre>${commits && JSON.stringify(commits, null, 2)}</pre>
      </div>
    `
    */
  }
}

render(html`<${Dashboard} />`, document.getElementById('dashboard'))

