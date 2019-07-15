package main

import (
	"bufio"
	"context"
	"encoding/json"
	"os"
	"github.com/google/go-github/v26/github"
)

func main() {
	client := github.NewClient(nil)

	// orgs, _, err := client.Organizations.List(context.Background(), "willnorris", nil)
	opt := &github.CommitsListOptions{}
	commits, _, err := client.Repositories.ListCommits(context.Background(), "ipfs", "go-ipfs", opt)

	if err != nil {
		panic(err)
	}

	b, err := json.Marshal(commits)

	if err != nil {
		panic(err)
	}

	f := bufio.NewWriter(os.Stdout)
	defer f.Flush()
	f.Write(b)
}
