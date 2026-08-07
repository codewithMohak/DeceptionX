package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("usage: potctl<command>")
		os.Exit(1)
	}
	
	switch os.Args[1] {
	case "version":
		fmt.Println("potctl v0.0.1")

	default:
		fmt.Printf("unknown command %s\n", os.Args[1])
		os.Exit(1)
	}
}
