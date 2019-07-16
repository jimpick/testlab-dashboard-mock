testlab-dashboard-mockup
========================

Test data, HTML mockups (coming soon).

* [Mock CSV Data](https://github.com/jimpick/testlab-dashboard-mockup/tree/master/csv)
* [Sample SQL Query](https://mockup-3knoa5s4ea-uc.a.run.app/mockup?sql=select+distinct+commits.*%2C+results.metricId%2C+metrics.description%2C+results.value%2C+metrics.unit+from+commits%2C+results%2C+metrics+where+commits.sha+%3D+results.sha+and+results.metricId+%3D+metrics.id+and+results.sha+%3D+commits.sha) (CSVs -> SQLite via Datasette, Cloud Run)
* [GitHub data scraper](https://github.com/jimpick/testlab-dashboard-mockup/tree/master/fetch/github-commits) (go)

# License

MIT
