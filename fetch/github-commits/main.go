package main

import (
	"context"
	"encoding/csv"
	"os"
	"strings"

	"github.com/google/go-github/v26/github"
)

func main() {
	client := github.NewClient(nil)

	opt := &github.CommitsListOptions{}
	commits, _, err := client.Repositories.ListCommits(context.Background(), "ipfs", "go-ipfs", opt)

	if err != nil {
		panic(err)
	}

	w := csv.NewWriter(os.Stdout)
	for _, commit := range commits {
		// sha, author.login, message, html_url, commit.author.date
		SHA := commit.GetSHA()
		Login := commit.GetAuthor().GetLogin()
		Message := commit.GetCommit().GetMessage()
		Message = strings.Join(strings.Split(Message, "\n"), " ")
		HTMLURL := commit.GetHTMLURL()
		Date := commit.GetCommit().GetAuthor().GetDate()
		w.Write([]string{SHA, Login, Message, HTMLURL, Date.String()})
		if err := w.Error(); err != nil {
			panic(err)
		}
	}

	w.Flush()
	if err := w.Error(); err != nil {
		panic(err)
	}
}
