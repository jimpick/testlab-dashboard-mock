package main

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/go-github/v26/github"
)

func main() {
	client := github.NewClient(nil)

	opt := &github.CommitsListOptions{}
	commits, _, err := client.Repositories.ListCommits(context.Background(), "ipfs", "go-ipfs", opt)

	if err != nil {
		panic(err)
	}

	type CommitSummary struct {
		SHA     string
		Login   string
		Message string
		HTMLURL string
		Date    time.Time
	}
	commitSummaries := make([]CommitSummary, 0)

	for _, commit := range commits {
		// sha, author.login, message, html_url, commit.author.date
		SHA := commit.GetSHA()
		Login := commit.GetAuthor().GetLogin()
		Message := commit.GetCommit().GetMessage()
		Message = strings.Join(strings.Split(Message, "\n"), " ")
		HTMLURL := commit.GetHTMLURL()
		Date := commit.GetCommit().GetAuthor().GetDate()
		commitSummaries = append(commitSummaries, CommitSummary{
			SHA,
			Login,
			Message,
			HTMLURL,
			Date,
		})
	}

	for i, commitSummary := range commitSummaries {
		fmt.Println(i, commitSummary.SHA)
		fmt.Println(" " + commitSummary.Login)
		fmt.Println(" " + commitSummary.Message)
		fmt.Println(" " + commitSummary.HTMLURL)
		fmt.Println("", commitSummary.Date)
		fmt.Println()
	}

	/*
		w := csv.NewWriter(os.Stdout)
		for _, commitSummary := range commitSummaries {
			w.Write([]string(commitSummary))
			if err := w.Error(); err != nil {
				panic(err)
			}
		}
		w.Flush()
		if err := w.Error(); err != nil {
			panic(err)
		}
	*/

	/*
		b, err := json.Marshal(commits)

		if err != nil {
			panic(err)
		}

		f := bufio.NewWriter(os.Stdout)
		defer f.Flush()
		f.Write(b)
	*/
}
